import prisma from '@config/prisma.config'
import AppError from '@errors/app.error'
import { IUserValidator } from '@interfaces/validator.interface'
import { CustomValidator } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { AppValidator } from './app.validator'

class UserValidator extends AppValidator implements IUserValidator {
  checkEmailTaken: CustomValidator = async (email) => {
    const user = await prisma.user.findFirst({ where: { email } })
    if (user) {
      throw new AppError('Email already in use', StatusCodes.CONFLICT)
    }
    return true
  }
  checkPasswordMatch: CustomValidator = (passwordConfirmation, { req }) => {
    if (passwordConfirmation !== req.body.password) {
      throw new AppError('Password confirmation does not match password', StatusCodes.UNPROCESSABLE_ENTITY)
    }
    return true
  }
}

const userValidator = new UserValidator()

export default userValidator
