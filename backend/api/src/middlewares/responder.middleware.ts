import ValidatorError from '@errors/validator.error'
import { ErrorRequestHandler, RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const errorResponderMiddleware: ErrorRequestHandler = (err, _, res, __) => {
  const status = err.code || StatusCodes.INTERNAL_SERVER_ERROR
  res.status(status).json(err instanceof ValidatorError ? err.errors : err.message)
}

export const invalidPathResponderMiddleware: RequestHandler = (_, res) => {
  res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
}
