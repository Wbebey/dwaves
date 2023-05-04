import { Router } from 'express'

import albumController from '@controllers/album.controller'
import { body } from 'express-validator'
import albumValidator from '@validators/album.validator'

const albumRouter = Router()

albumRouter.get('/', albumController.get)
albumRouter.post(
  '/',
  body('name').notEmpty().withMessage('Name is required'),
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .bail()
    .toUpperCase()
    .custom(albumValidator.isValidType),
  body('genre')
    .notEmpty()
    .withMessage('Genre is required')
    .bail()
    .custom(albumValidator.isValidGenre),
  albumValidator.validate,
  albumController.create
)

export default albumRouter
