import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import {
  ConcertTicketNFT,
  ConcertTicketNFT__factory,
  DwavesToken,
  DwavesToken__factory,
} from '../typechain-types'
import { ethers } from 'hardhat'
import { expect } from 'chai'

describe('ConcertTicketNFT', () => {
  let concertTicketNFTFactory: ConcertTicketNFT__factory
  let concertTicketNFT: ConcertTicketNFT
  let dwavesTokenFactory: DwavesToken__factory
  let dwavesToken: DwavesToken
  let decimals: number

  let deployer: SignerWithAddress
  let payer: SignerWithAddress
  let artist1: SignerWithAddress
  let artist2: SignerWithAddress
  let listener: SignerWithAddress

  let minterRole: string

  const concertEvent1 = {
    name: 'Test Concert 1',
    date: new Date().getTime(),
    location: 'Test Location 1',
    genre: 'Test Genre 1',
    artistName: 'Test Artist 1',
    ticketCount: 5,
    ticketPrice: 100,
  } satisfies ConcertTicketNFT.EventStruct
  const concertEvent2 = {
    name: 'Test Concert 2',
    date: new Date().getTime(),
    location: 'Test Location 2',
    genre: 'Test Genre 2',
    artistName: 'Test Artist 2',
    ticketCount: 3,
    ticketPrice: 200,
  } satisfies ConcertTicketNFT.EventStruct

  const deployContract = async () => {
    concertTicketNFT = await concertTicketNFTFactory.deploy(dwavesToken.address)
    await concertTicketNFT.deployed()

    minterRole = await concertTicketNFT.MINTER_ROLE()
    await concertTicketNFT.grantRole(minterRole, payer.address)
    concertTicketNFT = concertTicketNFT.connect(payer)
  }

  before(async () => {
    const [deployer_, payer_, artist1_, artist2_, listener_] =
      await ethers.getSigners()
    deployer = deployer_
    payer = payer_
    artist1 = artist1_
    artist2 = artist2_
    listener = listener_

    concertTicketNFTFactory = await ethers.getContractFactory(
      'ConcertTicketNFT',
      deployer
    )
    dwavesTokenFactory = await ethers.getContractFactory(
      'DwavesToken',
      deployer
    )

    dwavesToken = await dwavesTokenFactory.deploy(deployer.address)
    await dwavesToken.deployed()

    decimals = await dwavesToken.decimals()
  })

  describe('When deploying the contract', () => {
    beforeEach(deployContract)

    it('Creates a token with a name', async () => {
      expect(await concertTicketNFT.name()).to.be.equal(
        'Dwaves Concert Ticket NFT'
      )
    })

    it('Creates a token with a symbol', async () => {
      expect(await concertTicketNFT.symbol()).to.be.equal('DCTN')
    })

    it('Creates a token with a total supply of 0', async () => {
      expect(await concertTicketNFT.totalSupply()).to.be.equal(0)
    })

    it('Allows the artist to create a concert event', async () => {
      const tx = await concertTicketNFT.createEvent(
        artist1.address,
        concertEvent1
      )

      expect(tx)
        .to.changeTokenBalance(
          concertTicketNFT,
          artist1,
          concertEvent1.ticketCount
        )
        .and.to.emit(concertTicketNFT, 'Transfer')
        .withArgs(concertTicketNFT.address, artist1.address, 1)
    })

    describe('When a concert event has been created', () => {
      beforeEach(async () => {
        await Promise.all([
          concertTicketNFT.createEvent(artist1.address, concertEvent1),
          concertTicketNFT.createEvent(artist2.address, concertEvent2),
        ])
      })

      it('Allows to retrieve all tickets for a concert event', async () => {
        const tickets = await concertTicketNFT.getTicketsByAddress(
          artist1.address
        )

        expect(tickets.length).to.be.equal(concertEvent1.ticketCount)
      })

      it('Allows to retrive all tickets', async () => {
        const tickets = await concertTicketNFT.getAllTickets()

        expect(tickets.length).to.be.equal(
          concertEvent1.ticketCount + concertEvent2.ticketCount
        )
      })

      it('Allows to retrieve tickets by address', async () => {
        const tickets = await concertTicketNFT.getTicketsByAddress(
          artist1.address
        )

        expect(tickets.length).to.be.equal(concertEvent1.ticketCount)
      })

      it('Allows to retrieve my tickets', async () => {
        const tickets = await concertTicketNFT.connect(artist2).getMyTickets()

        expect(tickets.length).to.be.equal(concertEvent2.ticketCount)
      })

      it('Allows user to buy a ticket', async () => {
        await dwavesToken.transfer(
          listener.address,
          ethers.utils.parseUnits(
            concertEvent1.ticketPrice.toString(),
            decimals
          )
        )
        await dwavesToken
          .connect(listener)
          .approve(
            concertTicketNFT.address,
            ethers.utils.parseUnits(
              concertEvent1.ticketPrice.toString(),
              decimals
            )
          )

        const tx = await concertTicketNFT.buyTicket(listener.address, 1)
        const ticketPrice = ethers.utils.parseUnits(
          concertEvent1.ticketPrice.toString(),
          decimals
        )

        expect(tx)
          .to.changeTokenBalance(concertTicketNFT, listener, 1)
          .and.to.emit(concertTicketNFT, 'Transfer')
          .withArgs(artist1.address, listener.address, 1)
          .and.to.changeTokenBalances(
            dwavesToken,
            [listener, artist1],
            [-ticketPrice, ticketPrice]
          )
          .and.to.emit(dwavesToken, 'Transfer')
          .withArgs(listener.address, artist1.address, ticketPrice)

        const ticketInfo = await concertTicketNFT.getTicketInfo(1)
        expect(ticketInfo.isSold).to.be.equal(true)
      })
    })
  })
})
