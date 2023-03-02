import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import {
  DwavesToken,
  DwavesToken__factory,
  ICO,
  ICO__factory,
} from '../typechain-types'
import * as helpers from '@nomicfoundation/hardhat-network-helpers'

describe('ICO', () => {
  let dwavesTokenFactory: DwavesToken__factory
  let dwavesToken: DwavesToken
  let icoFactory: ICO__factory
  let ico: ICO
  let icoCap: BigNumber
  let rate: BigNumber
  let decimals: number

  let deployer: SignerWithAddress
  let limiter: SignerWithAddress
  let bank: SignerWithAddress
  let investor: SignerWithAddress

  let limiterRole: string

  const deployContract = async (
    openingDateDelta: number,
    closingDateDelta: number
  ): Promise<ICO> => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const openingDate = new Date(
      new Date(now.getTime()).setMonth(now.getMonth() + openingDateDelta)
    )
    const closingDate = new Date(
      new Date(now.getTime()).setMonth(now.getMonth() + closingDateDelta)
    )

    ico = await icoFactory.deploy(
      dwavesToken.address,
      bank.address,
      Math.floor(openingDate.getTime() / 1000),
      Math.floor(closingDate.getTime() / 1000)
    )
    await ico.deployed()

    return ico
  }

  before(async () => {
    const [deployer_, _, bank_, limiter_, investor_] = await ethers.getSigners()
    deployer = deployer_
    limiter = limiter_
    bank = bank_
    investor = investor_

    const [f1, f2] = await Promise.all([
      ethers.getContractFactory('DwavesToken', deployer),
      ethers.getContractFactory('ICO', deployer),
    ])
    dwavesTokenFactory = f1
    icoFactory = f2

    dwavesToken = await dwavesTokenFactory.deploy(bank.address)
    await dwavesToken.deployed()

    decimals = await dwavesToken.decimals()
  })

  describe('When deploying the contract', () => {
    before(async () => {
      ico = await deployContract(1, 2)

      const [limiterRole_, icoCap_] = await Promise.all([
        ico.LIMITER_ROLE(),
        ico.cap(),
      ])
      limiterRole = limiterRole_
      icoCap = icoCap_

      const dwavesToken_ = dwavesToken.connect(bank)

      const [rate_] = await Promise.all([
        ico.RATE(),
        dwavesToken_.approve(ico.address, icoCap),
        ico.grantRole(limiterRole, limiter.address),
      ])
      rate = rate_
    })

    it('Has a valid remaining token amount', async () => {
      const remaningTokens = await ico.remainingTokens()
      expect(remaningTokens).to.equal(icoCap)
    })

    it('Has a valid rate', async () => {
      const rate_ = await ico.RATE()
      expect(rate_).to.equal(rate)
    })

    it('Has a valid cap', async () => {
      const cap = await ico.cap()
      expect(cap).to.equal(icoCap)
    })

    it('Has a valid token allowance', async () => {
      const allowance = await dwavesToken.allowance(bank.address, ico.address)
      expect(allowance).to.equal(icoCap)
    })

    describe('When buying tokens', () => {
      const amount = ethers.utils.parseUnits('100', decimals)
      let snapshot: helpers.SnapshotRestorer

      before(async () => {
        snapshot = await helpers.takeSnapshot()
      })

      afterEach(() => {
        snapshot.restore()
      })

      it('Reverts if the ICO is not open', async () => {
        await expect(
          investor.sendTransaction({ to: ico.address, value: amount })
        ).to.be.revertedWith('ICO: not open')
      })

      it('Reverts if the ICO is closed', async () => {
        await helpers.time.increase(60 * 60 * 24 * 31 * 2 + 1)
        await expect(
          investor.sendTransaction({ to: ico.address, value: amount })
        ).to.be.revertedWith('ICO: not open')
      })

      it('Reverts if the amount is 0', async () => {
        await helpers.time.increase(60 * 60 * 24 * 31 + 1)
        await expect(
          investor.sendTransaction({ to: ico.address, value: 0 })
        ).to.be.revertedWith('ICO: wei amount is 0')
      })

      it('Reverts if the amount is greater than the cap', async () => {
        await helpers.time.increase(60 * 60 * 24 * 31 + 1)
        await expect(
          investor.sendTransaction({ to: ico.address, value: icoCap.add(1) })
        ).to.be.revertedWith('ICO: cap exceeded')
      })

      it('Allows to buy tokens', async () => {
        await helpers.time.increase(60 * 60 * 24 * 31 + 1)
        await expect(
          investor.sendTransaction({ to: ico.address, value: amount })
        )
          .to.changeTokenBalance(dwavesToken, investor, amount.mul(rate))
          .and.to.emit(dwavesToken, 'Transfer')
          .withArgs(bank.address, investor.address, amount.mul(rate))
      })
    })
  })
})
