import AppError from '@errors/app.error'
import { IUserValidator } from '@interfaces/validator.interface'
import userService from '@services/user.service'
import { CustomSanitizer, CustomValidator } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { AppValidator } from '@validators/app.validator'
import { ethers } from 'ethers'

class UserValidator extends AppValidator implements IUserValidator {
  isEmailTaken: CustomValidator = async (email: string) => {
    return this._isEmailTaken(email)
  }

  isNewEmailTaken: CustomValidator = async (email: string, { req }) => {
    if (email !== req.app.locals.user.email) {
      return this._isEmailTaken(email)
    }
    return true
  }

  toValidAddress: CustomSanitizer = async (address: string) => {
    if (!ethers.utils.isAddress(address)) {
      throw new AppError(
        'Invalid wallet address',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    }
    // in case address is valid but in ICAP format
    const formattedAddress = ethers.utils.getAddress(address)

    return formattedAddress
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

  toValidUserId: CustomSanitizer = async (userId: string): Promise<number> => {
    const user = await userService.findUnique({ id: +userId })
    if (!user) {
      throw new AppError('User not found', StatusCodes.UNPROCESSABLE_ENTITY)
    }
    return +userId
  }

  _isEmailTaken = async (email: string) => {
    const user = await userService.findUnique({ email })
    if (user) {
      throw new AppError('Email already in use', StatusCodes.CONFLICT)
    }
    return true
  }
}

const userValidator = new UserValidator()

export default userValidator
