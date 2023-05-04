import config from '@config/env.config'
import AppError from '@errors/app.error'
import { IAuthController } from '@interfaces/controller.interface'
import { CookieOptions, RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import userService from 'services/user.service'

const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + config.accessTokenExp * 60 * 1000),
  maxAge: config.accessTokenExp * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
}

if (process.env.NODE_ENV === 'production') {
  accessTokenCookieOptions.secure = true
}

class AuthController implements IAuthController {
  register: RequestHandler = async (req, res) => {
    const { username, email, password } = req.body
    const user = await userService.create({ username, email, password })

    res.status(StatusCodes.CREATED).json(user)
  }

  login: RequestHandler = async (req, res) => {
    const { email, password } = req.body
    const user = await userService.findFirst({ email })

    if (!user || !(await userService.verifyPassword(user.password, password))) {
      throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED)
    }

    const accessToken = userService.signToken(user)

    res.cookie('accessToken', accessToken, accessTokenCookieOptions)
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    })

    res.json({ accessToken })
  }
}

const authController = new AuthController()

export default authController
