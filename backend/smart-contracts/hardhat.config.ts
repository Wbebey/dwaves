import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'

dotenv.config()

const { ALCHEMY_API_KEY, DWAVES_DEPLOYER_PRIVATE_KEY } = process.env

if (!DWAVES_DEPLOYER_PRIVATE_KEY || !ALCHEMY_API_KEY) {
  console.error('💥 error loading env')
  process.exit(1)
}

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  defaultNetwork: 'localhost',
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [DWAVES_DEPLOYER_PRIVATE_KEY],
    },
  },
}

export default config
