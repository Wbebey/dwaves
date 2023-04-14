import { Router } from 'express'

import userController from '@controllers/user.controller'
import { body, query } from 'express-validator'
import userValidator from '@validators/user.validator'
import { FileType } from '@@types/pinata.type'

const currentUserRouter = Router()

currentUserRouter.get('/', userController.me)
currentUserRouter.get(
  '/popular',
  query('limit')
    .if(query('limit').exists())
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be an int between 1 and 20'),
  userValidator.validate,
  userController.getMyPopularMusics
)
currentUserRouter.get('/albums', userController.getMyAlbums)
currentUserRouter.get('/playlists', userController.getMyPlaylists)
currentUserRouter.get('/likedMusics', userController.getMyLikedMusics)
currentUserRouter.post(
  '/playlists',
  body('name').notEmpty().withMessage('Name is required'),
  body().custom(userValidator.hasOneFileOptional(FileType.COVER)),
  userValidator.validate,
  userController.createPlaylist
)
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
currentUserRouter.put(
  '/updateLikedMusics',
  body('musics').isArray().withMessage('Musics must be an array'),
  userValidator.validate,
  userController.updateLikedMusics
)

export default currentUserRouter
