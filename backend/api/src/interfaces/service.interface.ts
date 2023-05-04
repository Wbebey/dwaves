import { Prisma, User } from '@prisma/client'

interface IService {}

export interface IUserService extends IService {
  create: (user: Prisma.UserCreateInput) => Promise<User>
}
