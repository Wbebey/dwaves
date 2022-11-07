import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'

dotenv.config()

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY

if (!GOERLI_PRIVATE_KEY || !ALCHEMY_API_KEY) {
  console.error('💥 error loading env')
  process.exit(1)
}

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  defaultNetwork: 'localhost',
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  },
}

export default config
