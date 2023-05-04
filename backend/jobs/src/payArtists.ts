import { HttpFunction } from '@google-cloud/functions-framework'
import { PrismaClient } from '../../db/generated/client'
import ArtistPayer from '../../abi/ArtistPayer.json'
import { Alchemy, Network, Wallet } from 'alchemy-sdk'
import * as ethers from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

export const payArtists: HttpFunction = async (req, res) => {
  const { ALCHEMY_API_KEY, DWAVES_PAYER_PRIVATE_KEY } = process.env

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

  console.log(`Connected as: ${signer.address}`)

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

  console.log({ listenings, artistAddresses })

  if (artistAddresses.length === 0) {
    return res.send('No artist to pay')
  }

  for (const addr of artistAddresses) {
    const balance = await alchemy.core.getTokenBalances(addr, [
      '0x130A63b84c4c472Ea3304f8bFE1439B400E7cA4c',
    ])
    console.log(
      `Balance before transactions: ${addr}:`,
      parseInt(balance.tokenBalances[0].tokenBalance as string, 16) / 1e18
    )
  }

  const payments = await artistPayer.payArtists(artistAddresses, listenings)
  console.log(payments)

  for (const addr of artistAddresses) {
    const balance = await alchemy.core.getTokenBalances(addr, [
      '0x130A63b84c4c472Ea3304f8bFE1439B400E7cA4c',
    ])
    console.log(
      `Balance after transactions: ${addr}:`,
      parseInt(balance.tokenBalances[0].tokenBalance as string, 16) / 1e18
    )
  }

  res.json({ payments })
}
