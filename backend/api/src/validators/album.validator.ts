import AppError from '@errors/app.error'
import { IAlbumValidator } from '@interfaces/validator.interface'
import { AlbumType } from '@prisma/client'
import genreService from '@services/genre.service'
import { CustomSanitizer, CustomValidator, Meta } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { AppValidator } from '@validators/app.validator'
import albumService from "@services/album.service";

class AlbumValidator extends AppValidator implements IAlbumValidator {
  isValidType: CustomValidator = (type: string) => {
    if (!Object.values(AlbumType).includes(type as AlbumType)) {
      throw new AppError('Invalid album type', StatusCodes.CONFLICT)
    }
    return true
  }

  toValidGenre: CustomSanitizer = async (name: string) =>
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

  isValidSingleName: CustomValidator = async (name: string, {req}) =>
      this._isValidName(name, req.app.locals.user.id, AlbumType.SINGLE)

  isValidAlbumName: CustomValidator = async (name: string, {req}) =>
      this._isValidName(name, req.app.locals.user.id, AlbumType.ALBUM)

  private _isValidName = async (name: string, artistId: number, albumType: AlbumType) => {
    const album = await albumService.findMany({
      name: name, artistId, type: albumType
    })

    if (album.length > 0) {
      if (albumType===AlbumType.SINGLE) {
        throw new AppError('You already have a single music with this name', StatusCodes.CONFLICT)
      } else {
        throw new AppError('You already have an album with this name', StatusCodes.CONFLICT)
      }
    }
    return true
  }

  toValidMusicNames: CustomSanitizer = async (name: string) => {
    const musicNames = JSON.parse(name);
    if (!Array.isArray(musicNames)) {
      throw new AppError('musicNames is not an array', StatusCodes.CONFLICT)
    }

    return musicNames
  }
}

const albumValidator = new AlbumValidator()

export default albumValidator
