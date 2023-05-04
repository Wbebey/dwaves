import prisma from '@config/prisma.config'
import { IPlaylistService } from '@interfaces/service.interface'
import { Prisma, Playlist } from '@prisma/client'

class PlaylistService implements IPlaylistService {
  findMany = (where: Prisma.PlaylistWhereInput = {}): Promise<Playlist[]> =>
    prisma.playlist.findMany({ where })

  findUnique = (
    where: Prisma.PlaylistWhereUniqueInput
  ): Promise<Playlist | null> => prisma.playlist.findUnique({ where })

  create = (playlist: Prisma.PlaylistCreateInput): Promise<Playlist> =>
    prisma.playlist.create({ data: playlist })

  update = (
    where: Prisma.PlaylistWhereUniqueInput,
    playlistUpdate: Prisma.PlaylistUpdateInput
  ): Promise<Playlist> =>
    prisma.playlist.update({ where, data: playlistUpdate })

  delete = (where: Prisma.PlaylistWhereUniqueInput): Promise<Playlist> =>
    prisma.playlist.delete({ where })
}

const playlistService = new PlaylistService()

export default playlistService
