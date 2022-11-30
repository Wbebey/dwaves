import { Router } from 'express'

import musicController from '@controllers/music.controller'
import { body } from 'express-validator'
import musicValidator from '@validators/music.validator'
import { FileType } from '@@types/pinata.type'
import albumValidator from '@validators/album.validator'

const musicRouter = Router()

musicRouter.post(
  '/pinSingle',
  body('genre')
    .notEmpty()
    .withMessage('Genre is required')
    .bail()
    .customSanitizer(albumValidator.toValidGenre),
  body().custom(musicValidator.isFilePresent(FileType.COVER)),
  body().custom(musicValidator.isFilePresent(FileType.MUSIC)),
  musicValidator.validate,
  musicController.uploadSingle
)

musicRouter.get('/get', musicController.get)

export default musicRouter
