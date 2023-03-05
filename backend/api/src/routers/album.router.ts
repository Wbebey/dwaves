import { Router } from 'express'

import albumController from '@controllers/album.controller'
import { body, param, query } from 'express-validator'
import albumValidator from '@validators/album.validator'
import musicValidator from '@validators/music.validator'
import { FileType } from '@@types/pinata.type'
import userValidator from '@validators/user.validator'

const albumRouter = Router()

albumRouter.get(
  '/',
  query('genre').customSanitizer(albumValidator.toValidGenreIfExist),
  query('artistId')
    .if(query('artistId').exists())
    .isInt({ min: 1 })
    .withMessage('Album id must be a strictly positive int')
    .bail()
    .customSanitizer(userValidator.toValidUserId),
  albumValidator.validate,
  albumController.list
)
albumRouter.get(
  '/:id',
  param('id')
    .isInt({ min: 1 })
    .withMessage('Album id must be a strictly positive int'),
  albumValidator.validate,
  albumController.show
)
albumRouter.post(
  '/',
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .bail()
    .toUpperCase()
    .custom(albumValidator.isValidType),
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .custom(albumValidator.isValidName()),
  body('genre')
    .notEmpty()
    .withMessage('Genre is required')
    .bail()
    .customSanitizer(albumValidator.toValidGenre),
  body().custom(musicValidator.hasOneFile(FileType.COVER)),
  albumValidator.validate,
  albumController.create
)
albumRouter.delete(
  '/:id',
  param('id')
    .isInt({ min: 1 })
    .withMessage('Album id must be a strictly positive int'),
  albumValidator.validate,
  albumController.delete
)

export default albumRouter
