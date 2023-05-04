import { FileType } from '@@types/pinata.type'
import AppError from '@errors/app.error'
import { IMusicValidator } from '@interfaces/validator.interface'
import { CustomValidator } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { AppValidator } from '@validators/app.validator'

class MusicValidator extends AppValidator implements IMusicValidator {
  isFilePresent =
    (filetype: FileType): CustomValidator =>
    (_, { req }) => {
      if (!req.files || !req.files[filetype]) {
        throw new AppError(
          `${filetype} not found in request`,
          StatusCodes.BAD_REQUEST
        )
      }

      if (req.files[filetype].length > 1) {
        throw new AppError(
          `Only supporting single ${filetype} upload`,
          StatusCodes.BAD_REQUEST
        )
      }

      return true
    }
}

const musicValidator = new MusicValidator()

export default musicValidator
