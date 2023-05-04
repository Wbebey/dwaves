import { Router } from 'express'

import albumController from '@controllers/album.controller'
import { body, param, query } from 'express-validator'
import albumValidator from '@validators/album.validator'
import musicValidator from '@validators/music.validator'
import { FileType } from '@@types/pinata.type'

const albumRouter = Router()

albumRouter.get(
  '/',
  query('genre').bail().customSanitizer(albumValidator.toValidGenreIfExist),
  query('artistId').customSanitizer(albumValidator.toValidArtistIdIfExist),
  albumValidator.validate,
  albumController.list
)
albumRouter.get(
  '/:id',
  param('id').isInt({ min: 0 }).withMessage('Album id must be a positive int'),
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
  param('id').isInt({ min: 0 }).withMessage('Album id must be a positive int'),
  albumValidator.validate,
  albumController.delete
)

export default albumRouter
