import { User } from '@prisma/client'

export type ViewUser = Omit<User, 'password'>

export type UserAddressAndMonthlyListenings = {
  address: string
  monthlyListenings: { listenings: number }[]
}
