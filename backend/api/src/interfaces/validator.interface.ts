import { RequestHandler } from 'express'
import { CustomValidator } from 'express-validator'

interface IValidator {}

export interface IAppValidator extends IValidator {
  validate: RequestHandler
}

export interface IUserValidator extends IAppValidator {
  checkEmailTaken: CustomValidator
  checkPasswordMatch: CustomValidator
}
