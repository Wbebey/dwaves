import { ViewUser } from '@@types/user.type'
import { Prisma, User } from '@prisma/client'

interface IService {}

export interface IUserService extends IService {
  exclude<User, Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key>
  findMany: () => Promise<ViewUser[]>
  create: (user: Prisma.UserCreateInput) => Promise<ViewUser>
}
