import { Router } from 'express'

import musicController from '@controllers/music.controller'
import { body, query } from 'express-validator'
import musicValidator from '@validators/music.validator'
import { FileType } from '@@types/pinata.type'
import albumValidator from '@validators/album.validator'
import { requireUserWallet } from '@middlewares/auth.middleware'
import { AlbumType } from '@prisma/client'
import userValidator from '@validators/user.validator'

const musicRouter = Router()

musicRouter.get(
  '/',
  query('genre').bail().customSanitizer(albumValidator.toValidGenreIfExist),
  query('artistId')
    .if(query('artistId').exists())
    .isInt({ min: 1 })
    .withMessage('Album id must be a strictly positive int')
    .bail()
    .customSanitizer(userValidator.toValidUserId),
  musicValidator.validate,
  musicController.get
)

musicRouter.get(
  '/popular',
  query('genre').bail().customSanitizer(albumValidator.toValidGenreIfExist),
  query('artistId')
    .if(query('artistId').exists())
    .isInt({ min: 1 })
    .withMessage('Album id must be a strictly positive int')
    .bail()
    .customSanitizer(userValidator.toValidUserId),
  query('limit')
    .if(query('limit').exists())
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be an int between 1 and 20'),
  musicValidator.validate,
  musicController.getPopular
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
    .withMessage('Name is required')
    .bail()
    .custom(albumValidator.isValidName(AlbumType.SINGLE)),
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
    .withMessage('AlbumName is required')
    .bail()
    .custom(albumValidator.isValidName(AlbumType.ALBUM)),
  body('musicNames')
    .notEmpty()
    .withMessage('MusicNames is required')
    .bail()
    .customSanitizer(albumValidator.toValidMusicNames),
  body().custom(musicValidator.hasOneFile(FileType.COVER)),
  body().custom(musicValidator.hasFiles(FileType.MUSICS)),
  musicValidator.validate,
  musicController.uploadAlbum
)

musicRouter.post(
  '/incrementListenings',
  body('musicCID').notEmpty().withMessage('musicCID is required'),
  body('listeningsValue')
    .notEmpty()
    .withMessage('listeningsValue is required')
    .bail(),
  musicValidator.validate,
  musicController.incrementListeningsMetadata
)

export default musicRouter
