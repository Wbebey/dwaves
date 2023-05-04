import { IUserService } from '@interfaces/service.interface'
import prisma from '@config/prisma.config'
import { Prisma, User } from '@prisma/client'
import * as argon2 from 'argon2'
import tokenService from './token.service'
import config from '@config/env.config'

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

  findFirst = (where: Prisma.UserWhereInput) => {
    return prisma.user.findFirst({ where })
  }

  create = async (user: Prisma.UserCreateInput) => {
    const hashedPassword = await argon2.hash(user.password)
    user.password = hashedPassword
    const createdUser = await prisma.user.create({ data: user })

    return this.exclude(createdUser, ['password'])
  }

  signToken = (user: User) => {
    const accessToken = tokenService.signJwt(
      { sub: user.id.toString() },
      { expiresIn: `${config.accessTokenExp}` }
    )

    return accessToken
  }

  verifyPassword = (hashedPassword: string, candidatePassword: string) => {
    return argon2.verify(hashedPassword, candidatePassword)
  }
}

const userService = new UserService()

export default userService
