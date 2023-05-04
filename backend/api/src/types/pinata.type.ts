import { Genre } from '@prisma/client'

export enum FileType {
  COVER = 'cover',
  MUSIC = 'music',
  MUSICS = 'musics'
}

export type CoverMetadata = {
  type: FileType.COVER
}

export type MusicMetadata = {
  type: FileType.MUSIC
  artistId: number
  albumId: number
  genreId: number
  listenings: number
}

export type ViewMusic = {
  name: string
  src: string
  albumName: string
  genreName: string
  artistName: string
  listenings: number
}

export type PinataPinResponse = {
  IpfsHash: string
  PinSize: string
  Timestamp: string
}

export type MusicQuery = {
  genre?: Genre
}


type PinataMusic = {
  metadata: {
    name: string
    keyvalues: MusicMetadata
  },
  ipfs_pin_hash: string
}
export type PinataPinListResponse = {
  count: number
  rows: PinataMusic[]

}
