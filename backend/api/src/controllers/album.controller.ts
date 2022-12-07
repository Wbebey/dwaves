import { RequestHandler } from 'express'

import { IAlbumController } from '@interfaces/controller.interface'
import albumService from '@services/album.service'
import { UploadedFile } from 'express-fileupload'
import AppError from '@errors/app.error'
import { StatusCodes } from 'http-status-codes'
import pinataService from '@services/pinata.service'
import { AlbumGetRequestHandler } from '@@types/app.type'

class AlbumController implements IAlbumController {
  list: AlbumGetRequestHandler = async (req, res) => {
    const albums = await albumService.findMany({ genreId: req.query.genre?.id })

    res.json(albums)
  }

  show: RequestHandler = async (req, res) => {
    const album = await albumService.findUnique({ id: +req.params.id })
    if (!album) {
      throw new AppError('Album not found', StatusCodes.NOT_FOUND)
    }

    const rawMusics = await pinataService.getMusicFromIPFS({
      albumId: album.id,
    })
    const musics = rawMusics.map((music) => ({
      src: music.src,
      name: music.name,
      listenings: music.listenings,
    }))

    res.json({ ...album, musics })
  }

  create: RequestHandler = async (req, res) => {
    const cover = req.files!.cover as UploadedFile
    const { name, type, genre } = req.body

    const album = {
      name,
      type,
      artist: { connect: { id: req.app.locals.user.id } },
      genre: { connect: { id: genre.id } },
    }
    const createdAlbum = await albumService.create(album, cover)

    res.json(createdAlbum)
  }
}

const albumController = new AlbumController()

export default albumController
