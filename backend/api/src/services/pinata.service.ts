import axios from 'axios'
import {IPinataService} from "@interfaces/services.interface";
import FormData from 'form-data'
import env from "@config/env.config";
import {ReadStream} from "fs";

import userService from 'services/user.service'
import {User} from "@prisma/client";

const {pinataGatewayHost, pinataApiHost, pinataApiKey, pinataApiSecret} = env

type PinataPinResponse = {
    IpfsHash: string
    PinSize: string
    Timestamp: string
}

type Metadata = {
    type: 'cover' | 'music'
    artistId?: number
    albumId?: number
    genre?: string
    coverCid?: string
    listenings?: number
}

type PinataMetadata = {
    keyvalues: Metadata
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

class PinataService implements IPinataService {
    pinFileToIPFS : (file: ReadStream, metadata: Metadata) => Promise<string> = async (file: ReadStream, metadata: Metadata) => {
        const url = `${pinataApiHost}/pinning/pinFileToIPFS`
        //making axios POST request to Pinata ⬇️
        let data = new FormData();
        data.append('file', file);

        const metadataPinata = JSON.stringify({
            keyvalues: metadata
        });
        data.append('pinataMetadata', metadataPinata);

        const res = await axios.post<PinataPinResponse>(url, data, {
            headers: {
                'Content-Type': `multipart/form-data`,
                pinata_api_key: `${pinataApiKey}`,
                pinata_secret_api_key: `${pinataApiSecret}`,
            },
        })

        const coverCID = res.data.IpfsHash
        return coverCID
    }

    getAllMusicByGenreInPinata : (genre: string) => Promise<musicsByGenre[]> = async (genre: string) => {

        const urlGetPinata = `${pinataApiHost}/data/pinList?status=pinned&metadata[keyvalues][genre]={"value":"${genre}","op":"eq"}`

        console.log(urlGetPinata)

        const config = {
            method: 'get',
            url: urlGetPinata,
            headers: {
                pinata_api_key: `${pinataApiKey}`,
                pinata_secret_api_key: `${pinataApiSecret}`,
            }
        }

        const {data} = await axios(config);

        let musicsByGenre: musicsByGenre[] = []
        for (const row of data.rows) {
            //to find the name of the artist
            const artist = await userService.findFirst({ id: +row.metadata.keyvalues.artistId })
            musicsByGenre.push({
                musicName: row.metadata.name,
                musicUrl: `${pinataGatewayHost}/${row.ipfs_pin_hash}`,
                album: row.metadata.keyvalues.album,
                coverUrl: `${pinataGatewayHost}/${row.metadata.keyvalues.cover}`,
                genre: row.metadata.keyvalues.genre,
                artist: artist!.username,
                listenings: row.metadata.keyvalues.listenings
            })
        }

        return musicsByGenre
    }
}

const pinataService = new PinataService()

export default pinataService