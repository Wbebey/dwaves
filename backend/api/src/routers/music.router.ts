import { Router } from 'express'

import musicController from '@controllers/music.controller'
import { body, query } from 'express-validator'
import musicValidator from '@validators/music.validator'
import { FileType } from '@@types/pinata.type'
import albumValidator from '@validators/album.validator'
import { requireUserWallet } from '@middlewares/auth.middleware'

const musicRouter = Router()

musicRouter.get(
    '/',
    query('genre')
        .bail()
        .customSanitizer(albumValidator.toValidGenreIfExist),
    musicValidator.validate,
    musicController.get
)

musicRouter.use(requireUserWallet)

musicRouter.post(
  '/pinSingle',
  body('genre')
    .notEmpty()
    .withMessage('Genre is required')
    .bail()
    .customSanitizer(albumValidator.toValidGenre),
  body('name')
    .notEmpty()
    .withMessage('the name of the music is required')
    .bail()
    .custom(albumValidator.isValidSingleName),
  body().custom(musicValidator.hasOneFile(FileType.COVER)),
  body().custom(musicValidator.hasOneFile(FileType.MUSIC)),
  musicValidator.validate,
  musicController.uploadSingle
)

musicRouter.post(
    '/pinAlbum',
    body('genre')
        .notEmpty()
        .withMessage('Genre is required')
        .bail()
        .customSanitizer(albumValidator.toValidGenre),
    body('albumName')
        .notEmpty()
        .withMessage('albumName is required')
        .bail()
        .custom(albumValidator.isValidAlbumName),
    body('musicNames')
        .notEmpty()
        .withMessage('musicNames is required')
        .bail()
        .customSanitizer(albumValidator.toValidMusicNames),
    body().custom(musicValidator.hasOneFile(FileType.COVER)),
    body().custom(musicValidator.hasFiles(FileType.MUSICS)),
    musicValidator.validate,
    musicController.uploadAlbum
)

export default musicRouter
