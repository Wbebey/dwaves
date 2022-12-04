import { TokenType } from '@@types/token.type'
import AppError from '@errors/app.error'
import { User } from '@prisma/client'
import { ethers } from 'ethers'
import { RequestHandler, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import tokenService from 'services/token.service'
import userService from 'services/user.service'
import { Request } from 'express'

export const deserializeUser: RequestHandler = async (req, res, next) => {
  let accessToken
  if (req.headers.authorization?.startsWith('Bearer')) {
    accessToken = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.accessToken) {
    accessToken = req.cookies.accessToken
  }

  if (!accessToken) {
    throw new AppError('You are not logged in', StatusCodes.UNAUTHORIZED)
  }

  const decoded = tokenService.verifyJwt<{ sub: string }>(
    accessToken,
    TokenType.ACCESS
  )
  if (!decoded) {
    throw new AppError(
      'Invalid token or user does not exist',
      StatusCodes.UNAUTHORIZED
    )
  }

  const user = await userService.findFirst({ id: +decoded.sub })
  if (!user) {
    throw new AppError(
      'User with that token no longer exist',
      StatusCodes.UNAUTHORIZED
    )
  }

  req.app.locals.user = user
  next()
}

export const requireUser: RequestHandler = (req, res, next) => {
  _requireUser(req)
  next()
}

export const requireUserWallet: RequestHandler = (req, res, next) => {
  const user = _requireUser(req)
  if (user.address === ethers.constants.AddressZero) {
    throw new AppError(
      'Current user does not have any wallet registered',
      StatusCodes.UNAUTHORIZED
    )
  }
  next()
}

const _requireUser = (req: Request): User => {
  const user = req.app.locals.user
  if (!user) {
    throw new AppError(
      'Invalid token or session has expired',
      StatusCodes.UNAUTHORIZED
    )
  }

  return user
}
