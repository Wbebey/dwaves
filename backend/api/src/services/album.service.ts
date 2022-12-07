import { IAlbumService } from '@interfaces/service.interface'
import prisma from '@config/prisma.config'
import { Prisma } from '@prisma/client'
import { UploadedFile } from 'express-fileupload'
import { CoverMetadata, FileType } from '@@types/pinata.type'
import pinataService from '@services/pinata.service'
import logger from '@config/logger.config'
import { AlbumCreateInput } from '@@types/album.type'
import env from '@config/env.config'

const viewAlbumSelect = {
  id: true,
  coverCID: true,
  type: true,
  name: true,
  createdAt: true,
  genre: { select: { name: true } },
  artist: { select: { username: true } },
  subscribers: { select: { _count: true } },
}

type ViewAlbumSelectResult = Prisma.AlbumGetPayload<{
  select: typeof viewAlbumSelect
}>

class AlbumService implements IAlbumService {
  findMany = async (where: Prisma.AlbumWhereInput = {}) => {
    const viewAlbums = await prisma.album.findMany({
      where,
      select: viewAlbumSelect,
    })

    return viewAlbums.map(this.toViewAlbum)
  }

  findUnique = async (where: Prisma.AlbumWhereUniqueInput) => {
    const albums = await prisma.album.findUnique({
      where,
      select: viewAlbumSelect,
    })
    return albums && this.toViewAlbum(albums)
  }

  create = async (album: AlbumCreateInput, cover: UploadedFile) => {
    const coverMetadata: CoverMetadata = { type: FileType.COVER }
    const coverCID = await pinataService.pinFileToIPFS(cover, coverMetadata)

    logger.log(`cover: ${cover.name} - CID: ${coverCID}`)

    const data: Prisma.AlbumCreateInput = { ...album, coverCID }

    return prisma.album.create({ data })
  }

  private toViewAlbum = (viewAlbumSelectResult: ViewAlbumSelectResult) => {
    const album = {
      ...viewAlbumSelectResult,
      cover: `${env.pinataGatewayHost}/${viewAlbumSelectResult.coverCID}`,
      genre: viewAlbumSelectResult.genre.name,
      artist: viewAlbumSelectResult.artist.username,
      subscribers: viewAlbumSelectResult.subscribers.length,
    }
    const { coverCID, ...viewAlbum } = album

    return viewAlbum
  }
}

const albumService = new AlbumService()

export default albumService
