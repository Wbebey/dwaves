import { CoverMetadata, FileType } from '@@types/pinata.type'
import { PlaylistCreateInput } from '@@types/playlist.type'
import prisma from '@config/prisma.config'
import { IPlaylistService } from '@interfaces/service.interface'
import { Prisma, Playlist } from '@prisma/client'
import { UploadedFile } from 'express-fileupload'
import pinataService from './pinata.service'

class PlaylistService implements IPlaylistService {
  findMany = (where: Prisma.PlaylistWhereInput = {}): Promise<Playlist[]> =>
    prisma.playlist.findMany({ where })

  findUnique = (
    where: Prisma.PlaylistWhereUniqueInput
  ): Promise<Playlist | null> => prisma.playlist.findUnique({ where })

  create = async (
    playlist: PlaylistCreateInput,
    cover?: UploadedFile
  ): Promise<Playlist> => {
    // @ts-ignore
    const data: Prisma.PlaylistCreateInput = { ...playlist, coverCID: '' }

    if (cover) {
      const coverMetadata: CoverMetadata = { type: FileType.COVER }
      // @ts-ignore
      data.coverCID = await pinataService.pinFileToIPFS(cover, coverMetadata)
    }

    return prisma.playlist.create({ data })
  }

  update = async (
    where: Prisma.PlaylistWhereUniqueInput,
    playlistUpdate: Prisma.PlaylistUpdateInput,
    cover?: UploadedFile
  ): Promise<Playlist> => {
    if (cover) {
      const coverMetadata: CoverMetadata = { type: FileType.COVER }
      // @ts-ignore
      playlistUpdate.coverCID = await pinataService.pinFileToIPFS(
        cover,
        coverMetadata
      )
    }

    return prisma.playlist.update({ where, data: playlistUpdate })
  }

  delete = async (
    where: Prisma.PlaylistWhereUniqueInput
  ): Promise<Playlist> => {
    const playlist = await prisma.playlist.delete({ where })

    // @ts-ignore
    await pinataService.unpinFileFromIPFS(playlist.coverCID)

    return playlist
  }
}

const playlistService = new PlaylistService()

export default playlistService
