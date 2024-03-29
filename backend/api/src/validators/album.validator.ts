import AppError from '@errors/app.error'
import { IAlbumValidator } from '@interfaces/validator.interface'
import { AlbumType } from '@prisma/client'
import genreService from '@services/genre.service'
import { CustomSanitizer, CustomValidator, Meta } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { AppValidator } from '@validators/app.validator'
import albumService from '@services/album.service'
import userService from '@services/user.service'

class AlbumValidator extends AppValidator implements IAlbumValidator {
  isValidType: CustomValidator = (type: string) => {
    if (!Object.values(AlbumType).includes(type as AlbumType)) {
      throw new AppError('Invalid album type', StatusCodes.CONFLICT)
    }
    return true
  }

  toValidGenre: CustomSanitizer = (name: string) =>
    this._toValidGenre(name, StatusCodes.CONFLICT)

  toValidGenreIfExist: CustomSanitizer = (name: string) =>
    name ? this._toValidGenre(name, StatusCodes.UNPROCESSABLE_ENTITY) : null

  private _toValidGenre = async (name: string, status: StatusCodes) => {
    const genre = await genreService.findUnique({ name })
    if (!genre) {
      throw new AppError('Invalid genre', status)
    }
    return genre
  }

  isValidName =
    (albumType?: AlbumType): CustomValidator =>
    async (name: string, { req }) => {
      const type = albumType || req.body.type
      const album = await albumService.findMany({
        name,
        artistId: req.app.locals.user.id,
        type,
      })

      if (album.length > 0) {
        throw new AppError(
          `You already have a ${type} with this name`,
          StatusCodes.CONFLICT
        )
      }
      return true
    }

  toValidMusicNames: CustomSanitizer = async (names: string) => {
    const error = new AppError(
      'musicNames is not a valid array',
      StatusCodes.UNPROCESSABLE_ENTITY
    )

    try {
      const musicNames = JSON.parse(names)
      if (!Array.isArray(musicNames)) {
        throw error
      }
      return musicNames
    } catch (_) {
      throw error
    }
  }

  toValidArtistIdIfExist: CustomSanitizer = async (artistId: string) => {
    if (!artistId) {
      return undefined
    }

    const user = await userService.findFirst({ id: +artistId })
    if (!user) {
      throw new AppError('User not found', StatusCodes.UNPROCESSABLE_ENTITY)
    }
    return +artistId
  }
}

const albumValidator = new AlbumValidator()

export default albumValidator
