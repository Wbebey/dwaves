import { ErrorRequestHandler, RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const errorResponderMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.code || StatusCodes.INTERNAL_SERVER_ERROR
  res.status(status).json(err.message)
}

export const invalidPathResponderMiddleware: RequestHandler = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
}
