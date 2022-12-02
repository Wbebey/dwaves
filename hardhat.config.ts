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

const ALCHEMY_API_KEY = 'XURZZkpzFTF3Ts0p0jgkNZzco3OEpmVH'
const GOERLI_PRIVATE_KEY = '1aae3a6caa93df9651b3f3020741a6aec7721cefc70aae0b45097231d56ff54e'


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
  solidity: '0.8.17',
  defaultNetwork: 'localhost',
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: accounts as string[],
    },
  },
}

export default config
