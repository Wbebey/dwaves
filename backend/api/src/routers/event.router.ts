import eventController from '@controllers/event.controller'
import eventValidator from '@validators/event.validator'
import { Router } from 'express'
import { body, param } from 'express-validator'

const eventRouter = Router()

eventRouter.post(
  '/',
  body('name').notEmpty().withMessage('Name is required'),
  body('date').isISO8601().withMessage('Invalid date'),
  body('location').notEmpty().withMessage('Location is required'),
  body('genre')
    .notEmpty()
    .withMessage('Genre is required')
    .bail()
    .customSanitizer(eventValidator.toValidGenre),
  body('ticketCount')
    .isInt({ min: 0 })
    .withMessage('Ticket count must be a positive int'),
  body('ticketPrice')
    .isInt({ min: 0 })
    .withMessage('Ticket price must be a positive int'),
  eventValidator.validate,
  eventController.createConcertEvent
)
eventRouter.post(
  '/buyTicket/:id',
  param('id')
    .isInt({ min: 1 })
    .withMessage('Ticket id must be a strictly positive int'),
  eventValidator.validate,
  eventController.buyTicket
)

export default eventRouter
