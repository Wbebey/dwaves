import authController from '@controllers/auth.controller'
import { Router } from 'express'
import { body } from 'express-validator'
import userValidator from '@validators/user.validator'

const authRouter = Router()

authRouter.post(
  '/register',
  body('username')
    .isLength({ min: 3, max: 100 })
    .withMessage('Must be 3-100 characters long'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail()
    .custom(userValidator.checkEmailTaken),
  body('password')
    .isLength({ min: 8, max: 100 })
    .withMessage('Must be 8-100 characters long'),
  body('passwordConfirmation').custom(userValidator.checkPasswordMatch),
  userValidator.validate,
  authController.register
)

export default authRouter
