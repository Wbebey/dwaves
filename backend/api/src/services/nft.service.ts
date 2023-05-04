import { INFTService } from '@interfaces/service.interface'
import DwavesMusicNFT from '@abi/DwavesMusicNFT.json'
import ConcertTicketNFT from '@abi/ConcertTicketNFT.json'
import { Contract } from 'ethers'
import alchemy from '@config/alchemy.config'
import env from '@config/env.config'
import { ConcertEvent } from '@@types/event.type'

enum NFTType {
  DWAVES_MUSIC = 'DwavesMusicNFT',
  CONCERT_TICKET = 'ConcertTicketNFT',
}

class NFTService implements INFTService {
  private dwavesMusicNFT: Contract | null = null
  private concertTicketNFT: Contract | null = null

  mintDwavesMusicNFT = async (artistAddress: string, musicCID: string) => {
    const dwavesMusicNFT = await this._getContract(NFTType.DWAVES_MUSIC)
    const tokenId = await dwavesMusicNFT.mint(artistAddress, musicCID)

    return tokenId
  }

  batchMintDwavesMusicNFT = async (
    artistAddress: string,
    musicCIDs: string[]
  ) => {
    const dwavesMusicNFT = await this._getContract(NFTType.DWAVES_MUSIC)
    const tokenId = await dwavesMusicNFT.batch_mint(artistAddress, musicCIDs)

    return tokenId
  }

  createConcertEvent = async (event: ConcertEvent) => {
    const concertTicketNFT = await this._getContract(NFTType.CONCERT_TICKET)
    const tokenIds = await concertTicketNFT.createEvent(event)

    return tokenIds
  }

  private _getContract = async (type: NFTType) => {
    switch (type) {
      case NFTType.DWAVES_MUSIC:
        return this._getDwavesMusicNFTContract()
      case NFTType.CONCERT_TICKET:
        return this._getConcertTicketNFTContract()
    }
  }

  private _getConcertTicketNFTContract = async () => {
    if (!this.concertTicketNFT) {
      const dwavesPayer = await alchemy.getWallet(env.dwavesPayerPrivateKey)
      this.concertTicketNFT = new Contract(
        ConcertTicketNFT.address,
        ConcertTicketNFT.abi,
        dwavesPayer
      )
    }
    return this.concertTicketNFT
  }

  private _getDwavesMusicNFTContract = async () => {
    if (!this.dwavesMusicNFT) {
      const dwavesPayer = await alchemy.getWallet(env.dwavesPayerPrivateKey)
      this.dwavesMusicNFT = new Contract(
        DwavesMusicNFT.address,
        DwavesMusicNFT.abi,
        dwavesPayer
      )
    }
    return this.dwavesMusicNFT
  }
}

const nftService = new NFTService()

export default nftService
