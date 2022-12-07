import { INFTService } from '@interfaces/service.interface'
import DwavesMusicNFT from '@abi/DwavesMusicNFT.json'
import { Contract } from 'ethers'
import alchemy from '@config/alchemy.config'
import env from '@config/env.config'

class NFTService implements INFTService {
  private dwavesMusicNFT: Contract | null = null

  private getContract = async () => {
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

  mint = async (artistAddress: string, musicCID: string) => {
    const dwavesMusicNFT = await this.getContract()
    const tokenId = await dwavesMusicNFT.mint(artistAddress, musicCID)

    return tokenId
  }

  batchMint = async (artistAddress: string, musicCIDs: string[]) => {
    const dwavesMusicNFT = await this.getContract()
    const tokenId = await dwavesMusicNFT.batch_mint(artistAddress, musicCIDs)

    return tokenId
  }
}

const nftService = new NFTService()

export default nftService
