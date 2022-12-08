import { FileType } from '@@types/pinata.type'
import AppError from '@errors/app.error'
import { IMusicValidator } from '@interfaces/validator.interface'
import { CustomSanitizer, CustomValidator } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { AppValidator } from '@validators/app.validator'
import { FileArray } from 'express-fileupload'

class MusicValidator extends AppValidator implements IMusicValidator {
  hasOneFile =
    (filetype: FileType): CustomValidator =>
    (_, { req }) => {
      this._hasFiles(req.files, filetype)

      if (req.files[filetype].length > 1) {
        throw new AppError(
          `Only supporting single ${filetype} upload`,
          StatusCodes.BAD_REQUEST
        )
      }

      return true
    }

  hasFiles =
    (filetype: FileType): CustomValidator =>
    (_, { req }) =>
      this._hasFiles(req.files, filetype)

  private _hasFiles = (files: FileArray, filetype: FileType) => {
    if (!files || !files[filetype]) {
      throw new AppError(
        `${filetype} not found in request`,
        StatusCodes.BAD_REQUEST
      )
    }

    return true
  }

  toValidMusicUrl: CustomSanitizer = async (name: string) => {
    if(name.slice(-1)==='/') {
      throw new AppError(
        `The musicUrl must not end with a '/'`,
        StatusCodes.BAD_REQUEST
      )
    }

    const musicCIDArray = name.split('/')
    const musicCID = musicCIDArray[musicCIDArray.length - 1]
    return musicCID
  }
}

const musicValidator = new MusicValidator()

export default musicValidator
