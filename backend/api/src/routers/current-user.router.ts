import { Router } from 'express'

import userController from '@controllers/user.controller'
import { body } from 'express-validator'
import userValidator from '@validators/user.validator'

const currentUserRouter = Router()

currentUserRouter.get('/', userController.me)
currentUserRouter.put(
  '/addWallet',
  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .bail()
    .customSanitizer(userValidator.toValidAddress),
  userValidator.validate,
  userController.addWallet
)

export default currentUserRouter


