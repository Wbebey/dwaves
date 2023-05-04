import { IAuthController } from '@interfaces/controller.interface'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import userService from 'services/user.service'

class AuthController implements IAuthController {
  register: RequestHandler = async (req, res) => {
    const { username, email, password } = req.body
    const user = await userService.create({ username, email, password })

    res.status(StatusCodes.CREATED).json(user)
  }
}

const authController = new AuthController()

export default authController
