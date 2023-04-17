import AppError from '@errors/app.error'
import { IAlbumValidator } from '@interfaces/validator.interface'
import { AlbumType } from '@prisma/client'
import genreService from '@services/genre.service'
import { CustomSanitizer, CustomValidator } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { AppValidator } from '@validators/app.validator'
import albumService from '@services/album.service'

class AlbumValidator extends AppValidator implements IAlbumValidator {
  isValidType: CustomValidator = (type: string) => {
    if (!Object.values(AlbumType).includes(type as AlbumType)) {
      throw new AppError('Invalid album type', StatusCodes.CONFLICT)
    }
    return true
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

  toValidAlbumId: CustomSanitizer = async (albumId: string) => {
    const album = await albumService.findUnique({ id: +albumId })
    if (!album) {
      throw new AppError('Album not found', StatusCodes.UNPROCESSABLE_ENTITY)
    }
    return +albumId
  }
}

const albumValidator = new AlbumValidator()

export default albumValidator
