import { Router } from 'express'

import albumController from '@controllers/album.controller'
import { body } from 'express-validator'
import albumValidator from '@validators/album.validator'
import musicValidator from "@validators/music.validator";
import { FileType } from "@@types/pinata.type";

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
    .customSanitizer(albumValidator.toValidGenre),
    body().custom(musicValidator.hasOneFile(FileType.COVER)),
  albumValidator.validate,
  albumController.create
)

export default albumRouter
