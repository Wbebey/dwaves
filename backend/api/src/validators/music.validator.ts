import { FileType } from '@@types/pinata.type'
import AppError from '@errors/app.error'
import { IMusicValidator } from '@interfaces/validator.interface'
import genreService from '@services/genre.service'
import { CustomValidator } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { AppValidator } from './app.validator'

class MusicValidator extends AppValidator implements IMusicValidator {
  isValidGenre: CustomValidator = async (name: string) => {
    const genre = await genreService.findUnique({ name })
    if (!genre) {
      throw new AppError('Invalid genre', StatusCodes.CONFLICT)
    }
    return true
  }

  isFilePresent =
    (filetype: FileType): CustomValidator =>
    (_, { req }) => {
      if (!req.files || !req.files[filetype]) {
        throw new AppError(
          `${filetype} not found in request`,
          StatusCodes.BAD_REQUEST
        )
      }

      return true
    }
}

const musicValidator = new MusicValidator()

export default musicValidator
