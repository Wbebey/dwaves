import { RequestHandler } from 'express'

import { IGenreController } from '@interfaces/controller.interface'
import genreService from '@services/genre.service'

class GenreController implements IGenreController {
  get: RequestHandler = async (req, res) => {
    const genres = await genreService.findMany()

    res.json(genres)
  }
  create: RequestHandler = async (req, res) => {
    const createdGenre = await genreService.create({ name: req.body.name })

    res.json(createdGenre)
  }
}

const genreController = new GenreController()

export default genreController
