import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'

dotenv.config()

const {
  ALCHEMY_API_KEY,
  DWAVES_DEPLOYER_PRIVATE_KEY,
  DWAVES_PAYER_PRIVATE_KEY,
  DWAVES_BANK_PRIVATE_KEY,
} = process.env

const accounts = [
  DWAVES_DEPLOYER_PRIVATE_KEY,
  DWAVES_PAYER_PRIVATE_KEY,
  DWAVES_BANK_PRIVATE_KEY,
]

if (!ALCHEMY_API_KEY || accounts.includes(undefined)) {
  console.error('💥 error loading env')
  process.exit(1)
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: 'localhost',
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: accounts as string[],
    },
  },
}

export default config
