import { RequestHandler } from 'express'

import { IUserController } from '@interfaces/controller.interface'
import prisma from '@config/prisma.config'
import userService from 'services/user.service'

class UserController implements IUserController {
  get: RequestHandler = async (_, res) => {
    const users = await userService.findMany()

    res.json(users)
  }
  getMonthlyListenings: RequestHandler = async (_, res) => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const oneMonthBefore = new Date(new Date(now.getTime()).setMonth(now.getMonth() - 1))

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
      a.monthlyListenings.map((ml) => ml.listenings).reduce((prev, curr) => prev + curr)
    )
    const artistAddresses = artists.map((a) => a.address)

    res.json({ listenings, artistAddresses })
  }
}

const userController = new UserController()

export default userController
