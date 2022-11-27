import { IGenreService } from '@interfaces/service.interface'
import prisma from '@config/prisma.config'
import { Prisma } from '@prisma/client'

class GenreService implements IGenreService {
  findMany = (where: Prisma.GenreWhereInput = {}) =>
    prisma.genre.findMany({ where })
  findUnique = (where: Prisma.GenreWhereUniqueInput) =>
    prisma.genre.findUnique({ where })
  create = (genre: Prisma.GenreCreateInput) =>
    prisma.genre.create({ data: genre })
}

const genreService = new GenreService()

export default genreService
