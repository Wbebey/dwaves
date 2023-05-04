import AppError from '@errors/app.error'
import { IUserValidator } from '@interfaces/validator.interface'
import userService from '@services/user.service'
import { CustomValidator } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { AppValidator } from '@validators/app.validator'

class UserValidator extends AppValidator implements IUserValidator {
  isEmailTaken: CustomValidator = async (email: string) => {
    const user = await userService.findFirst({ email })
    if (user) {
      throw new AppError('Email already in use', StatusCodes.CONFLICT)
    }
    return true
  }
  doesPasswordMatch: CustomValidator = (passwordConfirmation, { req }) => {
    if (passwordConfirmation !== req.body.password) {
      throw new AppError(
        'Password confirmation does not match password',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    }
    return true
  }
}

const userValidator = new UserValidator()

export default userValidator
