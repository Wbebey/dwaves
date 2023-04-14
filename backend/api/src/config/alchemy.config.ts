import env from '@config/env.config'
import { Alchemy, Network } from 'alchemy-sdk'
import { Wallet } from 'ethers'

const getWallet = async (privateKey: string): Promise<Wallet> => {
  const settings = { apiKey: env.alchemyApiKey, network: Network.ETH_SEPOLIA }
  const alchemy = new Alchemy(settings)
  const alchemyProvider = await alchemy.config.getProvider()
  const dwavesPayer = new Wallet(privateKey, alchemyProvider)

  return dwavesPayer
}

export default {
  getWallet,
}
