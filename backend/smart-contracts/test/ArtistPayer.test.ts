import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import {
  ArtistPayer,
  ArtistPayer__factory,
  DwavesToken,
  DwavesToken__factory,
} from '../typechain-types'

describe('ArtistPayer', () => {
  let dwavesTokenFactory: DwavesToken__factory
  let dwavesToken: DwavesToken
  let artistPayerFactory: ArtistPayer__factory
  let artistPayer: ArtistPayer
  let decimals: number
  let rate: BigNumber

  let deployer: SignerWithAddress
  let payer: SignerWithAddress
  let bank: SignerWithAddress
  let artistAddresses: string[]

  let minterRole: string
  let payerRole: string

  before(async () => {
    const [deployer_, payer_, bank_, artist1_, artist2_] =
      await ethers.getSigners()
    deployer = deployer_
    payer = payer_
    bank = bank_
    artistAddresses = [artist1_.address, artist2_.address]

    const [f1, f2] = await Promise.all([
      ethers.getContractFactory('DwavesToken', deployer),
      ethers.getContractFactory('ArtistPayer', deployer),
    ])
    dwavesTokenFactory = f1
    artistPayerFactory = f2

    dwavesToken = await dwavesTokenFactory.deploy(bank.address)
    await dwavesToken.deployed()

    const [decimals_, minterRole_] = await Promise.all([
      dwavesToken.decimals(),
      dwavesToken.MINTER_ROLE(),
    ])
    decimals = decimals_
    minterRole = minterRole_
  })

  describe('When deploying the contract', () => {
    beforeEach(async () => {
      artistPayer = await artistPayerFactory.deploy(dwavesToken.address)
      await artistPayer.deployed()

      payerRole = await artistPayer.PAYER_ROLE()

      const [rate_] = await Promise.all([
        artistPayer.rate(),
        dwavesToken.grantRole(minterRole, artistPayer.address),
        artistPayer.grantRole(payerRole, payer.address),
      ])
      rate = rate_
    })

    it('Has a valid rate', async () => {
      const expectedRate = ethers.utils.parseUnits('0.06', decimals)
      const rate = (await artistPayer.rate()).toString()
      expect(rate).to.equal(expectedRate)
    })

    it("Allows payers to pay artists and emits a 'TokenPayments' event with the right arguments", async () => {
      const _artistPayer = artistPayer.connect(payer)
      const hasPayerRole = await _artistPayer.hasRole(payerRole, payer.address)
      expect(hasPayerRole).to.be.true

      const listenings = [45345, 53577]
      const payments = _artistPayer.payArtists(artistAddresses, listenings)
      const amounts = listenings.map((v) => rate.mul(v))

      await expect(payments)
        .to.changeTokenBalances(dwavesToken, artistAddresses, amounts)
        .and.to.emit(_artistPayer, 'TokenPayments')
        .withArgs(artistAddresses, amounts)
    })

    it('Reverts transaction if invalid arguments', async () => {
      const _artistPayer = artistPayer.connect(payer)
      const payments = _artistPayer.payArtists(artistAddresses, [45345])

      await expect(payments).to.be.revertedWith(
        'ArtistPayer: addresses and listenings have different lengths'
      )
    })

    it('Prevents non-payers to pay artists', async () => {
      const hasPayerRole = await artistPayer.hasRole(
        payerRole,
        deployer.address
      )
      expect(hasPayerRole).to.be.false

      const payments = artistPayer.payArtists(artistAddresses, [345345, 0])

      await expect(payments).to.be.revertedWith(
        `AccessControl: account ${deployer.address.toLowerCase()} is missing role ${payerRole}`
      )
    })
  })
})
