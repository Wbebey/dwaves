export type IPFSMetadata = {
  type: FileType
  artistId?: number
  albumId?: number
  genre?: string
  coverCid?: string
  listenings?: number
}

export type PinataPinResponse = {
  IpfsHash: string
  PinSize: string
  Timestamp: string
}

export enum FileType {
  COVER = 'cover',
  MUSIC = 'music',
}
