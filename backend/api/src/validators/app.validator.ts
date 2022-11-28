import ValidatorError from '@errors/validator.error'
import { IAppValidator } from '@interfaces/validator.interface'
import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

export class AppValidator implements IAppValidator {
  validate: RequestHandler = (req, _, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new ValidatorError(errors.array(), StatusCodes.BAD_REQUEST)
    }
    next()
  }
}

const appValidator = new AppValidator()

export default appValidator
