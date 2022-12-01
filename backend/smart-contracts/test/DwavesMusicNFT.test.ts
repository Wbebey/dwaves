import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { DwavesMusicNFT, DwavesMusicNFT__factory } from '../typechain-types'

describe('DwavesMusicNFT', () => {
  let dwavesMusicNFTFactory: DwavesMusicNFT__factory
  let dwavesMusicNFT: DwavesMusicNFT

  let deployer: SignerWithAddress
  let payer: SignerWithAddress
  let user1: SignerWithAddress
  let user2: SignerWithAddress

  let minterRole: string

  const MUSIC_CID1 = 'QmRbR2aJiXtG64CtjFZpV7D7TmBQfb9d4x8gwaYjyypgnK'
  const MUSIC_CID2 = 'QmZncoAxVsjfWvcrQFwwCKdwY2txBEUNkWu81oyaRxyKUd'

  const deployContract = async () => {
    dwavesMusicNFT = await dwavesMusicNFTFactory.deploy()
    await dwavesMusicNFT.deployed()

    minterRole = await dwavesMusicNFT.MINTER_ROLE()
    await dwavesMusicNFT.grantRole(minterRole, payer.address)
    dwavesMusicNFT = dwavesMusicNFT.connect(payer)
  }

  const mintTokens = async () => {
    const user1Mints = Array(10)
      .fill('')
      .map((_, i) => dwavesMusicNFT.mint(user1.address, MUSIC_CID1 + i))
    const user2Mints = Array(7)
      .fill('')
      .map((_, i) => dwavesMusicNFT.mint(user2.address, MUSIC_CID2 + i))

    await Promise.all([...user1Mints, ...user2Mints])
  }

  before(async () => {
    const [deployer_, payer_, _, user1_, user2_] = await ethers.getSigners()
    deployer = deployer_
    payer = payer_
    user1 = user1_
    user2 = user2_

    dwavesMusicNFTFactory = await ethers.getContractFactory(
      'DwavesMusicNFT',
      deployer
    )
  })

  describe('When deploying the contract', () => {
    beforeEach(deployContract)

    it('Creates a token with a name', async () => {
      expect(await dwavesMusicNFT.name()).to.be.equal(
        'Dwaves Authentic Music NFT'
      )
    })

    it('Creates a token with a symbol', async () => {
      expect(await dwavesMusicNFT.symbol()).to.be.equal('DAMN')
    })

    it("Allows payer to mint NFT to user and emit a 'Transfer' event", async () => {
      const nftMint = dwavesMusicNFT.mint(user1.address, MUSIC_CID1)
      expect(nftMint)
        .to.changeTokenBalance(dwavesMusicNFT, user1.address, 1)
        .and.to.emit(dwavesMusicNFT, 'Transfer')
        .withArgs(dwavesMusicNFT.address, user1.address, 1)
    })

    it('Prevents mint if account does not have the minter role', async () => {
      const dwavesMusicNFT_ = dwavesMusicNFT.connect(deployer)
      const nftMint = dwavesMusicNFT_.mint(user1.address, MUSIC_CID1)
      expect(nftMint).to.be.revertedWith(
        `AccessControl: account ${user1.address.toLowerCase()} is missing role ${minterRole}`
      )
    })
  })

  describe('When minting several tokens to two user', () => {
    const user1Tokens = Array(10)
      .fill('')
      .map((_, i) => MUSIC_CID1 + i)
    const user2Tokens = Array(7)
      .fill('')
      .map((_, i) => MUSIC_CID2 + i)

    before(() => deployContract().then(mintTokens))

    it('Allows getting all tokens', async () => {
      const allTokens = await dwavesMusicNFT.getAllTokens()
      expect(allTokens).to.have.all.members([...user1Tokens, ...user2Tokens])
    })

    it('Allows getting specific user tokens', async () => {
      const userTokens = await dwavesMusicNFT.getTokensByAddress(user1.address)
      expect(userTokens).to.have.all.members(user1Tokens)
    })

    it('Allows getting connected user tokens', async () => {
      const dwavesMusicNFT_ = dwavesMusicNFT.connect(user2)
      const userTokens = await dwavesMusicNFT_.getMyTokens()
      expect(userTokens).to.have.all.members(user2Tokens)
    })
  })
})
