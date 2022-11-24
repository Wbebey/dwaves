import {ReadStream} from "fs";

type Metadata = {
    type: 'cover' | 'music'
    artistId?: number
    albumId?: number
    genre?: string
    coverCid?: string
    listenings?: number
}

interface IService {}


export interface IPinataService extends IService {
    pinFileToIPFS: (file: ReadStream, metadata: Metadata) => Promise<string>
}

// export interface INFTService extends IService {
//     get: RequestHandler
//     getMonthlyListenings: RequestHandler
// }

