import { Prisma } from '@prisma/client'

export type PlaylistFilter = {
  creatorId?: number
}

export type PlaylistCreateInput = Omit<Prisma.PlaylistCreateInput, 'coverCID'>
