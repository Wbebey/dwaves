import { FileType } from '@@types/pinata.type'
import { RequestHandler } from 'express'
import { CustomSanitizer, CustomValidator } from 'express-validator'

interface IValidator {}

export interface IAppValidator extends IValidator {
  validate: RequestHandler
}

export interface IUserValidator extends IAppValidator {
  isEmailTaken: CustomValidator
  doesPasswordMatch: CustomValidator
}

export interface IMusicValidator extends IAppValidator {
  isFilePresent: (filetype: FileType) => CustomValidator
}

export interface IAlbumValidator extends IAppValidator {
  isValidType: CustomValidator
  toValidGenre: CustomSanitizer
  toValidGenreIfExist: CustomSanitizer
}

export interface IGenreValidator extends IAppValidator {
  doesGenreExist: CustomValidator
}
