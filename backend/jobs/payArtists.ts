import { HttpFunction } from '@google-cloud/functions-framework'
import { PrismaClient } from '@prisma/client'

export const payArtists: HttpFunction = async (req, res) => {
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

  res.json({ listenings, artistAddresses })
}
