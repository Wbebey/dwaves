import { IUserController } from '@interfaces/controller.interface'
import userService from 'services/user.service'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import AppError from '@errors/app.error'
import { User } from '@prisma/client'
import musicService from '@services/music.service'
import { LimitRequestHandler } from '@@types/app.type'
import albumService from '@services/album.service'
import playlistService from '@services/playlist.service'
import { UploadedFile } from 'express-fileupload'
import pinataService from '@services/pinata.service'
import { ConcertEvent } from '@@types/event.type'
import nftService from '@services/nft.service'

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

  getMyPlaylists: RequestHandler = async (req, res) => {
    const { id } = req.app.locals.user
    const playlists = await playlistService.findMany({ creatorId: id })

    res.json(playlists)
  }

  getMyLikedMusics: RequestHandler = async (req, res) => {
    const { myLikedMusics } = req.app.locals.user as User

    const musics = await Promise.all(
      myLikedMusics.map(async (musicCID) => {
        const ipfsMusics = await pinataService.getMusicFromIPFS({ musicCID })

        if (!ipfsMusics.length) {
          throw new AppError('Music not found', StatusCodes.NOT_FOUND)
        }

        return await musicService.toViewMusic(ipfsMusics[0])
      })
    )

    res.json(musics)
  }

  createPlaylist: RequestHandler = async (req, res) => {
    const { id } = req.app.locals.user
    const cover = req.files?.cover as UploadedFile | undefined
    const { name, description } = req.body

    const playlist = {
      name,
      description,
      creator: { connect: { id } },
      likes: 0,
    }
    const createdPlaylist = await playlistService.create(playlist, cover)

    res.json(createdPlaylist)
  }

  createConcertEvent: RequestHandler = async (req, res) => {
    const { address, username } = req.app.locals.user
    const { name, date, location, genre, ticketCount, ticketPrice } = req.body

    const concertEvent = {
      artistAddress: address,
      name,
      date: Date.parse(date),
      location,
      genre,
      artistName: username,
      ticketCount,
      ticketPrice,
      ticketSold: 0,
    } satisfies ConcertEvent

    const tx = await nftService.createConcertEvent(
      concertEvent
    )

    console.log({ tx })

    const r = await tx.wait()

    console.log({ r })

    res.json(r)
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

  updateLikedMusics: RequestHandler = async (req, res) => {
    const { id } = req.app.locals.user
    const { musics } = req.body

    const user = await userService.update({ id }, { myLikedMusics: musics })

    res.json(user)
  }
}

const userController = new UserController()

export default userController
