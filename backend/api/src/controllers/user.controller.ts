
import { IUserController } from '@interfaces/controller.interface'
import userService from 'services/user.service'
import { RequestHandler } from "express";

class UserController implements IUserController {
  get: RequestHandler = async (_, res) => {
    const users = await userService.findMany()

    res.json(users)
  }

  me: RequestHandler = (req, res) => {
    res.json(req.app.locals.user)
  }

  addWallet: RequestHandler = async (req, res) => {
    const { address } = req.body
    const user = await userService.update(
      { id: res.locals.user.id },
      { address }
    )

    res.json(user)
  }

  getMonthlyListenings: RequestHandler = async (_, res) => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const oneMonthBefore = new Date(
      new Date(now.getTime()).setMonth(now.getMonth() - 1)
    )

    const artists = await userService.findArtistsMonthlyListenings(
      oneMonthBefore,
      now
    )

    const listenings = artists.map((a) =>
      a.monthlyListenings
        .map((ml) => ml.listenings)
        .reduce((prev, curr) => prev + curr)
    )
    const artistAddresses = artists.map((a) => a.address)

    res.json({ listenings, artistAddresses })
  }
}

const userController = new UserController()

export default userController
