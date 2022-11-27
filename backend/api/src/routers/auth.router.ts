import authController from '@controllers/auth.controller'
import { Router } from 'express'
import { body, cookie } from 'express-validator'
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
    .bail()
    .normalizeEmail()
    .custom(userValidator.isEmailTaken),
  body('password')
    .isLength({ min: 8, max: 100 })
    .withMessage('Must be 8-100 characters long'),
  body('passwordConfirmation').custom(userValidator.doesPasswordMatch),
  userValidator.validate,
  authController.register
)
authRouter.post(
  '/login',
  body('email').notEmpty().withMessage('Email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  userValidator.validate,
  authController.login
)
authRouter.post(
  '/logout',
  cookie('loggedIn').notEmpty().withMessage('Already logged out'),
  userValidator.validate,
  authController.logout
)
authRouter.post(
  '/refresh',
  cookie('refreshToken').notEmpty().withMessage('Missing refresh token'),
  userValidator.validate,
  authController.refresh
)

export default authRouter
