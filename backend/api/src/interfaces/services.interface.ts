import {ReadStream} from "fs";

type Metadata = {
    type: 'cover' | 'music'
    artistId?: number
    albumId?: number
    genre?: string
    coverCid?: string
    listenings?: number
}

type musicsByGenre = {
    musicName: string
    musicUrl: string
    album: string
    coverUrl: string
    genre: string
    artist: string
    listenings: number
}

interface IService {}


export interface IPinataService extends IService {
    getAllMusicByGenreInPinata: (genre: string) => Promise<musicsByGenre[]>
    pinFileToIPFS: (file: ReadStream, metadata: Metadata) => Promise<string>
}

