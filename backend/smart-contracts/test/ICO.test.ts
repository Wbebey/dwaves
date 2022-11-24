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

describe('ArtistPayer', () => {
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
    beforeEach(async () => {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      const openingDate = new Date(
        new Date(now.getTime()).setMonth(now.getMonth() + 1)
      )
      const closingDate = new Date(
        new Date(now.getTime()).setMonth(now.getMonth() + 1)
      )

      ico = await icoFactory.deploy(
        dwavesToken.address,
        bank.address,
        Math.floor(openingDate.getTime() / 1000),
        Math.floor(closingDate.getTime() / 1000)
      )
      await ico.deployed()

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
  })
})
