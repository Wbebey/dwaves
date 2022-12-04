import { RequestHandler } from 'express'

import { IAlbumController } from '@interfaces/controller.interface'
import albumService from '@services/album.service'

class AlbumController implements IAlbumController {
  get: RequestHandler = async (req, res) => {
    const albums = await albumService.findMany()

    res.json(albums)
  }
  create: RequestHandler = async (req, res) => {
    const { name, type, genre, coverCID } = req.body
    const createdAlbum = await albumService.create({
      name,
      type,
      artist: { connect: { id: req.app.locals.user.id } },
      genre: { connect: { id: genre.id } },
      coverCID,
    })

    res.json(createdAlbum)
  }
}

const albumController = new AlbumController()

export default albumController
