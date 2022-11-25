import { TokenType } from '@@types/token.type'
import { ViewUser } from '@@types/user.type'
import { Prisma, User } from '@prisma/client'
import { JwtPayload, SignOptions } from 'jsonwebtoken'

interface IService {}

export interface IUserService extends IService {
  exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
  ): Omit<User, Key>
  findMany: () => Promise<ViewUser[]>
  findFirst: (
    where: Prisma.UserWhereInput,
    includePassword?: boolean
  ) => Promise<User | ViewUser | null>
  create: (user: Prisma.UserCreateInput) => Promise<ViewUser>
  signToken: (user: User) => { accessToken: string; refreshToken: string }
  verifyPassword: (
    hashedPassword: string,
    candidatePassword: string
  ) => Promise<boolean>
}

export interface ITokenService extends IService {
  signJwt: (
    payload: JwtPayload,
    tokenType: TokenType,
    options?: SignOptions
  ) => string
  verifyJwt: <T>(token: string, tokenType: TokenType) => T | null
}
