import { FileType } from '@@types/pinata.type'
import { AlbumType } from '@prisma/client'
import { RequestHandler } from 'express'
import { CustomSanitizer, CustomValidator } from 'express-validator'

interface IValidator {}

export interface IAppValidator extends IValidator {
  validate: RequestHandler
  hasOneFile: (filetype: FileType) => CustomValidator
  hasFiles: (filetype: FileType) => CustomValidator
  hasOneFileOptional: (filetype: FileType) => CustomValidator
  toValidGenre: CustomSanitizer
  toValidGenreIfExist: CustomSanitizer
}

export interface IUserValidator extends IAppValidator {
  isEmailTaken: CustomValidator
  isNewEmailTaken: CustomValidator
  toValidAddress: CustomSanitizer
  doesPasswordMatch: CustomValidator
  toValidUserId: CustomSanitizer
}

export interface IMusicValidator extends IAppValidator {}

export interface IAlbumValidator extends IAppValidator {
  isValidType: CustomValidator
  isValidName: (type: AlbumType) => CustomValidator
  toValidMusicNames: CustomSanitizer
}

export interface IGenreValidator extends IAppValidator {
  doesGenreExist: CustomValidator
}

export interface IPlaylistValidator extends IAppValidator {}
