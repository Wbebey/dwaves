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

export type ViewMusic = MusicMetadata & { src: string }

export type PinataPinResponse = {
  IpfsHash: string
  PinSize: string
  Timestamp: string
}

export type MusicQuery = {
  genreId?: number
  albumId?: number
}

export type PinataPinListResponse = {
  count: number
  rows: PinataMusic[]
}

export type PinataQueryFilter = Record<
  string,
  { value: string | number; op: string }
>

type PinataMusic = {
  metadata: {
    name: string
    keyvalues: MusicMetadata
  }
  ipfs_pin_hash: string
}
