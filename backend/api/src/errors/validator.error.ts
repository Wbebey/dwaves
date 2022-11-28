import { ValidationError } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import AppError from '@errors/app.error'

class ValidatorError extends AppError {
  public errors: ValidationError[]

  constructor(errors: ValidationError[], code: StatusCodes) {
    super(errors[0].msg, code)

    this.errors = errors
  }
}

export default ValidatorError
