import logger from '@config/logger.config'
import ValidatorError from '@errors/validator.error'
import { ErrorRequestHandler, RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const requestLoggerMiddleware: RequestHandler = (req, _, next) => {
  logger.log(`${req.method} | ${req.url}`)
  next()
}

export const errorLoggerMiddleware: ErrorRequestHandler = (
  err,
  _,
  __,
  next
) => {
  const code = err.code || StatusCodes.INTERNAL_SERVER_ERROR
  const status = err.status || ReasonPhrases.INTERNAL_SERVER_ERROR

  logger.error(`${code} ${status} | ${err.message}`)

  if (err instanceof ValidatorError) {
    logger.error(err.errors)
  }

  if (process.env.NODE_ENV === 'development') {
    logger.error(err.stack)
  }

  next(err)
}
