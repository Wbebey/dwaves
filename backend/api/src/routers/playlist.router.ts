import playlistController from '@controllers/playlist.controller'
import playlistValidator from '@validators/playlist.validator'
import userValidator from '@validators/user.validator'
import { Router } from 'express'
import { body, param, query } from 'express-validator'

const playlistRouter = Router()

playlistRouter.get(
  '/',
  query('creatorId')
    .if(query('creatorId').exists())
    .isInt({ min: 1 })
    .withMessage('Album id must be a strictly positive int')
    .bail()
    .customSanitizer(userValidator.toValidUserId),
  playlistValidator.validate,
  playlistController.list
)
playlistRouter.get(
  '/:id',
  param('id')
    .isInt({ min: 1 })
    .withMessage('Playlist id must be a strictly positive int'),
  playlistValidator.validate,
  playlistController.show
)
playlistRouter.post(
  '/',
  body('creatorId')
    .isInt({ min: 1 })
    .withMessage('Album id must be a strictly positive int')
    .bail()
    .customSanitizer(userValidator.toValidUserId),
  body('name').notEmpty().withMessage('Name is required'),
  playlistValidator.validate,
  playlistController.create
)
playlistRouter.put(
  '/:id',
  param('id')
    .isInt({ min: 1 })
    .withMessage('Playlist id must be a strictly positive int'),
  body('name').notEmpty().withMessage('Name is required'),
  body('likes').isInt({ min: 0 }).withMessage('Likes must be a positive int'),
  body('musics').isArray().withMessage('Musics must be an array'),
  playlistValidator.validate,
  playlistController.update
)
playlistRouter.delete(
  '/:id',
  param('id')
    .isInt({ min: 1 })
    .withMessage('Playlist id must be a strictly positive int'),
  playlistController.delete
)

export default playlistRouter
