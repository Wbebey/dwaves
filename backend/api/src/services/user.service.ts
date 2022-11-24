import { IUserService } from '@interfaces/service.interface'
import prisma from '@config/prisma.config'
import { Prisma } from '@prisma/client'
import * as argon2 from 'argon2'

class UserService implements IUserService {
  exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
  ): Omit<User, Key> {
    for (let key of keys) {
      delete user[key]
    }
    return user
  }

  findMany = async () => {
    const users = await prisma.user.findMany()

    return users.map((user) => this.exclude(user, ['password']))
  }

  create = async (user: Prisma.UserCreateInput) => {
    const hashedPassword = await argon2.hash(user.password)
    user.password = hashedPassword
    const createdUser = await prisma.user.create({ data: user })

    return this.exclude(createdUser, ['password'])
  }
}

const userService = new UserService()

export default userService
