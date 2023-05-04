import AppError from '@errors/app.error'
import { IAlbumValidator } from '@interfaces/validator.interface'
import { AlbumType } from '@prisma/client'
import genreService from '@services/genre.service'
import { CustomSanitizer, CustomValidator } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { AppValidator } from '@validators/app.validator'

class AlbumValidator extends AppValidator implements IAlbumValidator {
  isValidType: CustomValidator = (type: string) => {
    if (!Object.values(AlbumType).includes(type as AlbumType)) {
      throw new AppError('Invalid album type', StatusCodes.CONFLICT)
    }
    return true
  }

  toValidGenre: CustomSanitizer = async (name: string) => {
    const genre = await genreService.findUnique({ name })
    if (!genre) {
      throw new AppError('Invalid genre', StatusCodes.CONFLICT)
    }
    return genre
  }
}

const albumValidator = new AlbumValidator()

export default albumValidator
