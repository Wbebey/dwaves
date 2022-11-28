import { TokenType } from '@@types/token.type'
import env from '@config/env.config'
import AppError from '@errors/app.error'
import { IAuthController } from '@interfaces/controller.interface'
import { User } from '@prisma/client'
import { CookieOptions, RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import tokenService from 'services/token.service'
import userService from 'services/user.service'

const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + env.accessTokenExp * 60 * 1000),
  maxAge: env.accessTokenExp * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
}

const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + env.refreshTokenExp * 60 * 1000),
  maxAge: env.refreshTokenExp * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
}

if (process.env.NODE_ENV === 'production') {
  accessTokenCookieOptions.secure = true
  refreshTokenCookieOptions.secure = true
}

class AuthController implements IAuthController {
  register: RequestHandler = async (req, res) => {
    const { username, email, password } = req.body
    const user = await userService.create({ username, email, password })

    res.status(StatusCodes.CREATED).json(user)
  }

  login: RequestHandler = async (req, res) => {
    const { email, password } = req.body
    const user = (await userService.findFirst({ email }, true)) as User | null

    if (!user || !(await userService.verifyPassword(user.password, password))) {
      throw new AppError(
        'Invalid email or password',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    }

    const { accessToken, refreshToken } = userService.signToken(user)

    res.cookie('accessToken', accessToken, accessTokenCookieOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
    res.cookie('loggedIn', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    })

    res.json({ accessToken })
  }

  logout: RequestHandler = (_, res) => {
    res.cookie('accessToken', '', { maxAge: 1 })
    res.cookie('refreshToken', '', { maxAge: 1 })
    res.cookie('loggedIn', '', { maxAge: 1 })

    res.status(StatusCodes.NO_CONTENT).send()
  }

  refresh: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    const decoded = tokenService.verifyJwt<{ sub: string }>(
      refreshToken,
      TokenType.REFRESH
    )
    if (!decoded) {
      throw new AppError(
        'Invalid refresh token',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    }

    const user = await userService.findFirst({ id: +decoded.sub })
    if (!user) {
      throw new AppError(
        'User with that token no longer exist',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    }

    const refreshedAccessToken = tokenService.signJwt(
      { sub: user.id.toString() },
      TokenType.ACCESS,
      { expiresIn: `${env.accessTokenExp}m` }
    )

    // Send the access token as cookie
    res.cookie('accessToken', refreshedAccessToken, accessTokenCookieOptions)
    res.cookie('loggedIn', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    })

    res.json({ accessToken: refreshedAccessToken })
  }
}

const authController = new AuthController()

export default authController
