import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

const ALCHEMY_API_KEY = 'XURZZkpzFTF3Ts0p0jgkNZzco3OEpmVH'
const GOERLI_PRIVATE_KEY = '1aae3a6caa93df9651b3f3020741a6aec7721cefc70aae0b45097231d56ff54e'

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
