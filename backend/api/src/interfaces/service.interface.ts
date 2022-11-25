import { ViewUser } from '@@types/user.type'
import { Prisma, User } from '@prisma/client'
import { JwtPayload } from 'jsonwebtoken'

interface IService {}

export interface IUserService extends IService {
  exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
  ): Omit<User, Key>
  findMany: () => Promise<ViewUser[]>
  findFirst: (where: Prisma.UserWhereInput) => Promise<User | null>
  create: (user: Prisma.UserCreateInput) => Promise<ViewUser>
  signToken: (user: User) => string
  verifyPassword: (
    hashedPassword: string,
    candidatePassword: string
  ) => Promise<boolean>
}

export interface ITokenService extends IService {
  signJwt: (payload: JwtPayload) => string
  verifyJwt: <T>(token: string) => T | null
}
