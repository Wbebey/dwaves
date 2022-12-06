import { IAlbumService } from '@interfaces/service.interface'
import prisma from '@config/prisma.config'
import { Prisma } from '@prisma/client'
import { UploadedFile } from "express-fileupload";
import { CoverMetadata, FileType } from "@@types/pinata.type";
import pinataService from "@services/pinata.service";
import logger from "@config/logger.config";

class AlbumService implements IAlbumService {
  findMany = (where: Prisma.AlbumWhereInput = {}) =>
    prisma.album.findMany({ where })

  create = async (album: Prisma.AlbumCreateInput, cover: UploadedFile) => {
    const coverMetadata: CoverMetadata = { type: FileType.COVER }
    album.coverCID = await pinataService.pinFileToIPFS(cover, coverMetadata)
    logger.log(`cover: ${cover.name} - CID: ${album.coverCID}`)

    return prisma.album.create({ data: album })
  }
}

const albumService = new AlbumService()

export default albumService
