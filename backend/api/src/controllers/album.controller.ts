import { RequestHandler } from 'express'

import { IAlbumController } from '@interfaces/controller.interface'
import albumService from '@services/album.service'
import { UploadedFile } from 'express-fileupload'
import AppError from '@errors/app.error'
import { StatusCodes } from 'http-status-codes'
import userService from "@services/user.service";
import genreService from "@services/genre.service";
import env from "@config/env.config";

class AlbumController implements IAlbumController {
  get: RequestHandler = async (req, res) => {
    const { type } = req.query

    if(type === 'preview') {
      const albums = await albumService.findMany()

      let artistIds : number[] = []
      let genreIds : number[] = []

      for (const album of albums) {
        artistIds.push(album.artistId)
        genreIds.push(album.genreId)
      }

      artistIds = [...new Set(artistIds)]
      genreIds = [...new Set(genreIds)]

      const artists = await userService.findMany({id: { in: artistIds}})
      const genres = await genreService.findMany({id: {in: genreIds}})


      const albumsPreview = albums.map(album => {
        return {
          albumName: album.name,
          coverUrl: `${env.pinataGatewayHost}/${album.coverCID}`,
          genre: genres.find(x => x.id === album.genreId)?.name || '',
          artistName: artists.find(x => x.id === album.artistId)?.username || '',
        }
      })
      res.json(albumsPreview)
      return
    }

    const albums = await albumService.findMany()
    res.json(albums)
  }

  show: RequestHandler = async (req, res) => {
    const album = await albumService.findUnique({ id: +req.params.id })
    if (!album) {
      throw new AppError('Album not found', StatusCodes.NOT_FOUND)
    }

    res.json(album)
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
