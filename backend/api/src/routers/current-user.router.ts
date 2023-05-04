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
currentUserRouter.put(
  '/updateInfo',
  body('username')
    .isLength({ min: 3, max: 100 })
    .withMessage('Must be 3-100 characters long'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .bail()
    .normalizeEmail()
    .custom(userValidator.isNewEmailTaken),
  userValidator.validate,
  userController.updateInfo
)
currentUserRouter.put(
  '/updatePassword',
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('password')
    .isLength({ min: 8, max: 100 })
    .withMessage('Must be 8-100 characters long'),
  body('passwordConfirmation').custom(userValidator.doesPasswordMatch),
  userValidator.validate,
  userController.updatePassword
)

export default currentUserRouter
