import { Prisma } from '@prisma/client'

export type AlbumCreateInput = Omit<Prisma.AlbumCreateInput, 'coverCID'>

export type AlbumFilters = {where: Prisma.AlbumWhereInput, include: Prisma.AlbumInclude} | {where: Prisma.AlbumWhereInput}
