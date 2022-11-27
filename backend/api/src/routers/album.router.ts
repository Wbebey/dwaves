import { Router } from 'express'

import albumController from '@controllers/album.controller'
import { body } from 'express-validator'
import albumValidator from '@validators/album.validator'

const albumRouter = Router()

albumRouter.get('/', albumController.get)
albumRouter.post(
  '/',
  body('name').notEmpty().withMessage('Name is required'),
  albumValidator.validate,
  albumController.create
)

export default albumRouter
