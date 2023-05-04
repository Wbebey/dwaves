import { Genre } from '@prisma/client'

export enum FileType {
  COVER = 'cover',
  MUSIC = 'music',
  MUSICS = 'musics',
}

export type CoverMetadata = {
  type: FileType.COVER
}

export type MusicMetadata = {
  type: FileType.MUSIC
  name: string
  artistId: number
  albumId: number
  genreId: number
  listenings: number
}

export type ViewMusic = MusicMetadata & { src: string; cid: string }

export type ViewMusicDetail = ViewMusic & {
  artist: string
  genre: string
  albumName: string
  albumCover: string
  albumDate: string | Date
}

export type PinataPinResponse = {
  IpfsHash: string
  PinSize: string
  Timestamp: string
}

export type MusicFilter = {
  genre?: Genre
  albumId?: number
  artistId?: number
  musicCID?: string
}

export type PopularMusicFilter = MusicFilter & {
  limit?: number
}

export type PinataPinListResponse = {
  count: number
  rows: PinataMusic[]
}

export type PinataQueryFilter = Record<string, { value: string; op: string }>

type PinataMusic = {
  metadata: {
    name: string
    keyvalues: MusicMetadata
  }
  ipfs_pin_hash: string
}
