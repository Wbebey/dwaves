import AppError from '@errors/app.error'
import { IGenreValidator } from '@interfaces/validator.interface'
import genreService from '@services/genre.service'
import { CustomValidator } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { AppValidator } from './app.validator'

class GenreValidator extends AppValidator implements IGenreValidator {
  doesGenreExist: CustomValidator = async (name: string) => {
    const genre = await genreService.findUnique({ name })
    if (genre) {
      throw new AppError('Genre already exists', StatusCodes.CONFLICT)
    }
    return true
  }
}

const genreValidator = new GenreValidator()

export default genreValidator
