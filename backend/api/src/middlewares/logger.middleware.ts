import logger from '@config/logger.config'
import { ErrorRequestHandler, RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const requestLoggerMiddleware: RequestHandler = (req, res, next) => {
  logger.log(`${req.method} | ${req.url}`)
  next()
}

export const errorLoggerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const code = err.code || StatusCodes.INTERNAL_SERVER_ERROR
  const status = err.status || ReasonPhrases.INTERNAL_SERVER_ERROR

  logger.error(`${code} ${status} | ${err.message}`)

  if (process.env.NODE_ENV === 'development') {
    logger.error(err.stack)
  }

  next(err)
}
