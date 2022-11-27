import { IAlbumService } from '@interfaces/service.interface'
import prisma from '@config/prisma.config'
import { Prisma } from '@prisma/client'

class AlbumService implements IAlbumService {
  findMany = (where: Prisma.AlbumWhereInput = {}) =>
    prisma.album.findMany({ where })

  create = (album: Prisma.AlbumCreateInput) =>
    prisma.album.create({ data: album })
}

const albumService = new AlbumService()

export default albumService
