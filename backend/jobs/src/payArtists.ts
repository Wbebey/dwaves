import { Alchemy, Network } from 'alchemy-sdk'
import * as ethers from 'ethers'
import * as dotenv from 'dotenv'
import axios from 'axios'

//! Load env before apiRoutes
dotenv.config()

import routes from './utils/apiRoutes'
import { MonthlyListenings } from './utils/apiModels'
import ArtistPayer from './abi/ArtistPayer.json'
import { checkEnv } from './utils/checkEnv'

const main = async () => {
  const config = {
    alchemyApiKey: checkEnv('ALCHEMY_API_KEY'),
    dwavesPayerPrivateKey: checkEnv('DWAVES_PAYER_PRIVATE_KEY'),
  }

  const settings = {
    apiKey: config.alchemyApiKey,
    network: Network.ETH_GOERLI,
  }
  const alchemy = new Alchemy(settings)
  const alchemyProvider = await alchemy.config.getProvider()
  const signer = new ethers.Wallet(
    config.dwavesPayerPrivateKey,
    alchemyProvider
  )

  const artistPayer = new ethers.Contract(
    ArtistPayer.address,
    ArtistPayer.abi,
    signer
  )

  const res = await axios.get<MonthlyListenings>(routes.MONTHLY_LISTENINGS)
  const { listenings, artistAddresses } = res.data

  const addressesListenings = artistAddresses.reduce((acc, el, i) => {
    return { ...acc, [el]: `${listenings[i]} listenings` }
  }, {})
  console.log('Artists to pay: ', addressesListenings)

  if (artistAddresses.length === 0) {
    console.log('No artist to pay')
    return
  }

  await artistPayer.payArtists(artistAddresses, listenings)
}

main()
  .then(() => {
    console.log('Done')
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
