import AppError from '@errors/app.error'
import { IPlaylistValidator } from '@interfaces/validator.interface'
import playlistService from '@services/playlist.service'
import { AppValidator } from '@validators/app.validator'
import { CustomSanitizer } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

class PlaylistValidator extends AppValidator implements IPlaylistValidator {
  toValidPlaylistId: CustomSanitizer = async (playlistId: string) => {
    const playlist = await playlistService.findUnique({ id: +playlistId })
    if (!playlist) {
      throw new AppError('Playlist not found', StatusCodes.UNPROCESSABLE_ENTITY)
    }

    return +playlistId
  }
}

const playlistValidator = new PlaylistValidator()

export default playlistValidator
