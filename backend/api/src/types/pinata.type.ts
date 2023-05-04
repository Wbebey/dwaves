export type IPFSMetadata = {
  type: 'cover' | 'music'
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