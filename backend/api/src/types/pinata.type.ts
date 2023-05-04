export enum FileType {
  COVER = 'cover',
  MUSIC = 'music',
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

export type MusicWithMetadata = {
  musicName: string
  musicUrl: string
  album: string
  coverUrl: string
  genre: string
  artist: string
  listenings: number
}

export type PinataPinResponse = {
  IpfsHash: string
  PinSize: string
  Timestamp: string
}


export type PinataGetResponse = {
  rows: any
}
