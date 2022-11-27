import { Router } from 'express'
import { body } from 'express-validator'

import genreController from '@controllers/genre.controller'
import genreValidator from '@validators/genre.validator'

const genreRouter = Router()

genreRouter.get('/', genreController.get)
genreRouter.post(
  '/',
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .custom(genreValidator.doesGenreExist),
  genreValidator.validate,
  genreController.create
)

export default genreRouter
