import { IUserService } from '@interfaces/service.interface'
import prisma from '@config/prisma.config'
import { Prisma } from '@prisma/client'

class UserService implements IUserService {
  create = (user: Prisma.UserCreateInput) => prisma.user.create({ data: user })
}

const userService = new UserService()

export default userService
