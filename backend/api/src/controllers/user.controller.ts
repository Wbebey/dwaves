import { RequestHandler } from 'express'

import { IUserController } from '@interfaces/controller.interface'
import prisma from '@config/prisma.config'

class UserController implements IUserController {
  get: RequestHandler = async (_, res) => {
    const users = await prisma.user.findMany()

    res.json(users)
  }
}

export default UserController
