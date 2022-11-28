import logger from '@config/logger.config'
import ValidatorError from '@errors/validator.error'
import { ErrorRequestHandler, RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const errorResponderMiddleware: ErrorRequestHandler = (
  err,
  _,
  res,
  __
) => {
  const { message } = err

  const status = err.code || StatusCodes.INTERNAL_SERVER_ERROR
  const error = err instanceof ValidatorError ? err.errors : { ...err, message }

  res.status(status).json(error)
}

export const invalidPathResponderMiddleware: RequestHandler = (_, res) => {
  res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
}
