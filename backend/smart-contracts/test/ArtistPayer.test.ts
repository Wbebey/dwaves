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
  let ownerAddress: string
  let recipientAddress: string
  let recipient: SignerWithAddress
  let minterRole: string
  let payerRole: string
  let recipientContract: ArtistPayer
  let tokensPerListening: BigNumber

  before(async () => {
    const [owner, spender] = await ethers.getSigners()
    recipient = spender
    ownerAddress = owner.address
    recipientAddress = spender.address

    const f1 = ethers.getContractFactory('DwavesToken', owner)
    const f2 = ethers.getContractFactory('ArtistPayer', owner)
    const factories = await Promise.all([f1, f2])
    dwavesTokenFactory = factories[0]
    artistPayerFactory = factories[1]

    dwavesToken = await dwavesTokenFactory.deploy()
    await dwavesToken.deployed()

    const results = await Promise.all([
      dwavesToken.decimals(),
      dwavesToken.MINTER_ROLE(),
    ])
    decimals = results[0]
    minterRole = results[1]
  })

  describe('When deploying the contract', () => {
    beforeEach(async () => {
      artistPayer = await artistPayerFactory.deploy(dwavesToken.address)
      await artistPayer.deployed()

      recipientContract = artistPayer.connect(recipient)
      payerRole = await artistPayer.PAYER_ROLE()

      const p1 = dwavesToken.grantRole(minterRole, artistPayer.address)
      const p2 = artistPayer.grantRole(payerRole, ownerAddress)
      const p3 = artistPayer.tokens_per_listening()
      const res = await Promise.all([p1, p2, p3])
      tokensPerListening = res[2]
    })

    it('Allows payers to pay artists', async () => {
      const ownerHasPayerRole = await artistPayer.hasRole(
        payerRole,
        ownerAddress
      )
      expect(ownerHasPayerRole).to.be.true

      const listenings = [45345, 53577]
      const artistAddresses = [ownerAddress, recipientAddress]
      const payments = artistPayer.payArtists(artistAddresses, listenings)
      const amounts = listenings.map((v) => tokensPerListening.mul(v))

      await expect(payments).to.changeTokenBalances(
        dwavesToken,
        artistAddresses,
        amounts
      )
    })

    it('Reverts transaction if invalid arguments', async () => {
      const listenings = [45345]
      const artistAddresses = [ownerAddress, recipientAddress]
      const payments = artistPayer.payArtists(artistAddresses, listenings)

      await expect(payments).to.be.revertedWithoutReason()
    })

    it('Prevents non-payers to pay artists', async () => {
      const recipientHasPayerRole = await artistPayer.hasRole(
        payerRole,
        recipientAddress
      )
      expect(recipientHasPayerRole).to.be.false

      const listenings = [45345, 53577]
      const artistAddresses = [ownerAddress, recipientAddress]
      const payments = recipientContract.payArtists(artistAddresses, listenings)

      await expect(payments).to.be.revertedWith('Caller is not a payer')
    })
  })
})
