import { User } from '@prisma/client'

export type ViewUser = Omit<User, 'password'>
