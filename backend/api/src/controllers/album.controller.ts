import { RequestHandler } from 'express'

import { IAlbumController } from '@interfaces/controller.interface'
import prisma from '@config/prisma.config'

class AlbumController implements IAlbumController {
  get: RequestHandler = async (req, res) => {
    const albums = await prisma.album.findMany({
      where: {
        artistId: req.body.artistId,
      },
    })

    res.json(albums)
  }
  create: RequestHandler = async (req, res) => {
    const createdAlbum = await prisma.album.create({
      data: {
        name: req.body.name,
        artistId: req.body.artistId,
      },
    })
  
    res.json(createdAlbum)
  }
}

export default AlbumController
