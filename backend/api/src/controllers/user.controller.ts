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

  followArtist: RequestHandler = async (req, res) => {
    const { id } = req.app.locals.user
    const { id: artistId } = req.params

    if (id === artistId) {
      throw new AppError(
        'You cannot follow yourself',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    }

    const user = await userService.followArtist(id, +artistId)

    res.json(user)
  }

  unfollowArtist: RequestHandler = async (req, res) => {
    const { id } = req.app.locals.user
    const { id: artistId } = req.params

    if (id === artistId) {
      throw new AppError(
        'You cannot unfollow yourself',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    }

    const user = await userService.unfollowArtist(id, +artistId)

    res.json(user)
  }

  likeAlbum: RequestHandler = async (req, res) => {
    const { id } = req.app.locals.user
    const { id: albumId } = req.params

    const user = await userService.likeAlbum(id, +albumId)

    res.json(user)
  }

  dislikeAlbum: RequestHandler = async (req, res) => {
    const { id } = req.app.locals.user
    const { id: albumId } = req.params

    const user = await userService.dislikeAlbum(id, +albumId)

    res.json(user)
  }

  likePlaylist: RequestHandler = async (req, res) => {
    const { id } = req.app.locals.user
    const { id: playlistId } = req.params

    const user = await userService.likePlaylist(id, +playlistId)

    res.json(user)
  }

  dislikePlaylist: RequestHandler = async (req, res) => {
    const { id } = req.app.locals.user
    const { id: playlistId } = req.params

    const user = await userService.dislikePlaylist(id, +playlistId)

    res.json(user)
  }
}

const userController = new UserController()

export default userController
