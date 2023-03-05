import { PlaylistGetRequestHandler } from '@@types/app.type'
import AppError from '@errors/app.error'
import { IPlaylistController } from '@interfaces/controller.interface'
import pinataService from '@services/pinata.service'
import playlistService from '@services/playlist.service'
import { RequestHandler } from 'express'
import { UploadedFile } from 'express-fileupload'
import { StatusCodes } from 'http-status-codes'

class PlaylistController implements IPlaylistController {
  list: PlaylistGetRequestHandler = async (req, res) => {
    const { creatorId } = req.query
    const playlists = await playlistService.findMany({ creatorId })

    res.json(playlists)
  }
  show: RequestHandler = async (req, res) => {
    const playlist = await this._getPlaylistIfExists(+req.params.id)

    const musics = await Promise.all(
      playlist.musics.map(async (musicCID) => {
        const ipfsMusics = await pinataService.getMusicFromIPFS({ musicCID })

        if (!ipfsMusics.length) {
          throw new AppError('Music not found', StatusCodes.NOT_FOUND)
        }

        return ipfsMusics[0]
      })
    )

    res.json({ ...playlist, musics })
  }
  create: RequestHandler = async (req, res) => {
    const cover = req.files?.cover as UploadedFile | undefined
    const { creatorId, name } = req.body

    const playlist = {
      name,
      creator: { connect: { id: creatorId } },
      likes: 0,
    }
    const createdPlaylist = await playlistService.create(playlist, cover)

    res.json(createdPlaylist)
  }
  update: RequestHandler = async (req, res) => {
    const cover = req.files?.cover as UploadedFile | undefined
    const playlist = await this._getPlaylistIfExists(+req.params.id)

    const { name, likes, musics } = req.body

    const updatedPlaylist = await playlistService.update(
      { id: playlist.id },
      { name, likes, musics },
      cover
    )

    res.json(updatedPlaylist)
  }
  delete: RequestHandler = async (req, res) => {
    const playlist = await this._getPlaylistIfExists(+req.params.id)

    await playlistService.delete({ id: playlist.id })

    res.status(StatusCodes.NO_CONTENT).send()
  }

  private _getPlaylistIfExists = async (id: number) => {
    const playlist = await playlistService.findUnique({ id })
    if (!playlist) {
      throw new AppError('Playlist not found', StatusCodes.NOT_FOUND)
    }

    return playlist
  }
}

const playlistController = new PlaylistController()

export default playlistController
