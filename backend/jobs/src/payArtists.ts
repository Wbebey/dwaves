import { HttpFunction } from '@google-cloud/functions-framework'
import { PrismaClient } from '../../db/generated/client'
import ArtistPayer from '../../abi/ArtistPayer.json'
import { Alchemy, Network } from 'alchemy-sdk'
import * as ethers from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

export const payArtists: HttpFunction = async (_, res) => {
  const { ALCHEMY_API_KEY, DWAVES_PAYER_PRIVATE_KEY } = process.env

  if (!DWAVES_PAYER_PRIVATE_KEY || !ALCHEMY_API_KEY) {
    console.error('💥 error loading env')
    process.exit(1)
  }

  const settings = {
    apiKey: ALCHEMY_API_KEY,
    network: Network.ETH_GOERLI,
  }
  const alchemy = new Alchemy(settings)
  const alchemyProvider = await alchemy.config.getProvider()
  const signer = new ethers.Wallet(
    DWAVES_PAYER_PRIVATE_KEY as string,
    alchemyProvider
  )

  const artistPayer = new ethers.Contract(
    ArtistPayer.address,
    ArtistPayer.abi,
    signer
  )

  const prisma = new PrismaClient()

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const oneMonthBefore = new Date(
    new Date(now.getTime()).setMonth(now.getMonth() - 1)
  )

  const artists = await prisma.user.findMany({
    //* Find users with at least one record in MonthlyListenings for the previous month
    where: {
      monthlyListenings: {
        some: {
          date: {
            gte: oneMonthBefore,
            lt: now,
          },
        },
      },
    },
    select: {
      address: true,
      monthlyListenings: {
        //* Select ONLY the MonthlyListenings of the previous month
        where: {
          date: {
            gte: oneMonthBefore,
            lt: now,
          },
        },
        select: {
          listenings: true,
        },
      },
    },
  })

  const listenings = artists.map((a) =>
    a.monthlyListenings
      .map((ml) => ml.listenings)
      .reduce((prev, curr) => prev + curr)
  )
  const artistAddresses = artists.map((a) => a.address)

  const addressesListenings = artistAddresses.reduce((acc, el, i) => {
    return { ...acc, [el]: `${listenings[i]} listenings` }
  }, {})
  console.log('Artists to pay: ', addressesListenings)

  if (artistAddresses.length === 0) {
    return res.send('No artist to pay')
  }

  const transaction = await artistPayer.payArtists(artistAddresses, listenings)

  res.json({ transaction })
}
