import { IUserController } from '@interfaces/controller.interface'
import userService from 'services/user.service'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppError from '@errors/app.error'
import { User } from '@prisma/client'
import musicService from '@services/music.service'
import { LimitRequestHandler } from '@@types/app.type'
import albumService from '@services/album.service'

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
      { id: req.app.locals.user.id },
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

  getMyPopularMusics: LimitRequestHandler = async (req, res) => {
    const { id } = req.app.locals.user
    const { limit } = req.query
    const popularMusics = await musicService.getPopularMusics(
      { artistId: id },
      limit
    )

    res.json(popularMusics)
  }

  getMyAlbums: RequestHandler = async (req, res) => {
    const { id } = req.app.locals.user
    const albums = await albumService.findMany({ artistId: id })

    res.json(albums)
  }

  updateInfo: RequestHandler = async (req, res) => {
    const { username, email } = req.body

    const user = await userService.update(
      { id: req.app.locals.user.id },
      { username, email }
    )

    res.json(user)
  }

  updatePassword: RequestHandler = async (req, res) => {
    const { id } = req.app.locals.user
    const { oldPassword, password } = req.body

    const user = (await userService.findUnique({ id }, true)) as User | null

    if (
      !user ||
      !(await userService.verifyPassword(user.password, oldPassword))
    ) {
      throw new AppError('Invalid password', StatusCodes.UNPROCESSABLE_ENTITY)
    }

    const userUpdated = await userService.update({ id }, { password })

    res.json(userUpdated)
  }
}

const userController = new UserController()

export default userController
