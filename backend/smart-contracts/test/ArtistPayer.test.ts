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
    const [_deployer, _payer, _bank, _artist1, _artist2] =
      await ethers.getSigners()
    deployer = _deployer
    payer = _payer
    bank = _bank
    artistAddresses = [_artist1.address, _artist2.address]

    const [_f1, _f2] = await Promise.all([
      ethers.getContractFactory('DwavesToken', deployer),
      ethers.getContractFactory('ArtistPayer', deployer),
    ])
    dwavesTokenFactory = _f1
    artistPayerFactory = _f2

    dwavesToken = await dwavesTokenFactory.deploy(bank.address)
    await dwavesToken.deployed()

    const [_decimals, _minterRole] = await Promise.all([
      dwavesToken.decimals(),
      dwavesToken.MINTER_ROLE(),
    ])
    decimals = _decimals
    minterRole = _minterRole
  })

  describe('When deploying the contract', () => {
    beforeEach(async () => {
      artistPayer = await artistPayerFactory.deploy(dwavesToken.address)
      await artistPayer.deployed()

      payerRole = await artistPayer.PAYER_ROLE()

      const [_rate] = await Promise.all([
        artistPayer.rate(),
        dwavesToken.grantRole(minterRole, artistPayer.address),
        artistPayer.grantRole(payerRole, payer.address),
      ])
      rate = _rate
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
        'ArtistPayer: addresses and listenings do not have same length'
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
