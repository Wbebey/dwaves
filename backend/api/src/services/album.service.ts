import { IAlbumService } from '@interfaces/service.interface'
import prisma from '@config/prisma.config'
import { Prisma } from '@prisma/client'
import { UploadedFile } from 'express-fileupload'
import { CoverMetadata, FileType } from '@@types/pinata.type'
import pinataService from '@services/pinata.service'
import logger from '@config/logger.config'
import { AlbumCreateInput } from '@@types/album.type'
import env from '@config/env.config'

class AlbumService implements IAlbumService {
  findMany = (where: Prisma.AlbumWhereInput = {}) =>
    prisma.album.findMany({ where })

  findUnique = async (where: Prisma.AlbumWhereUniqueInput) => {
    const albumDb = await prisma.album.findUnique({
      where,
      select: {
        id: true,
        coverCID: true,
        type: true,
        name: true,
        createdAt: true,
        genre: {
          select: {
            name: true,
          },
        },
        artist: {
          select: {
            username: true,
          },
        },
        subscribers: {
          select: {
            _count: true,
          },
        },
      },
    })
    if (!albumDb) {
      return null
    }

    const album = {
      ...albumDb,
      cover: `${env.pinataGatewayHost}/${albumDb.coverCID}`,
      genre: albumDb.genre.name,
      artist: albumDb.artist.username,
      subscribers: albumDb.subscribers.length,
    }

    const { coverCID, ...viewAlbum } = album

    return viewAlbum
  }

  create = async (album: AlbumCreateInput, cover: UploadedFile) => {
    const coverMetadata: CoverMetadata = { type: FileType.COVER }
    const coverCID = await pinataService.pinFileToIPFS(cover, coverMetadata)

    logger.log(`cover: ${cover.name} - CID: ${coverCID}`)

    const data: Prisma.AlbumCreateInput = { ...album, coverCID }

    return prisma.album.create({ data })
  }
}

const albumService = new AlbumService()

export default albumService
