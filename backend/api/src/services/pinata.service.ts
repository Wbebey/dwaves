import axios from 'axios'
import { IPinataService } from '@interfaces/service.interface'
import FormData from 'form-data'
import env from '@config/env.config'
import genreService from "@services/genre.service"
import userService from "@services/user.service";
import albumService from "@services/album.service";
import {
  CoverMetadata,
  MusicMetadata,
  MusicWithMetadata,
  PinataPinResponse,
  PinataGetResponse,
  MusicQuery
} from '@@types/pinata.type'
import { Readable } from 'stream'
import { UploadedFile } from 'express-fileupload'



class PinataService implements IPinataService {
  pinFileToIPFS = async (
    file: UploadedFile,
    metadata: CoverMetadata | MusicMetadata
  ) => {
    const url = `${env.pinataApiHost}/pinning/pinFileToIPFS`

    let data = new FormData()
    const metadataPinata = JSON.stringify({ keyvalues: metadata })
    data.append('pinataMetadata', metadataPinata)
    const stream = Readable.from(file.data)
    data.append('file', stream, { filepath: file.name })

    const res = await axios.post<PinataPinResponse>(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: env.pinataApiKey,
        pinata_secret_api_key: env.pinataApiSecret,
      },
    })

    const cid = res.data.IpfsHash

    return cid
  }

  getMusicFromIPFS = async (
      query: MusicQuery
  ): Promise<MusicWithMetadata[]> => {

    const {genre} = query

    let url: string
    if (genre) {
      url = `${env.pinataApiHost}/data/pinList?status=pinned&metadata[keyvalues]={"type":{"value":"music","op":"eq"},"genreId":{"value":"${query.genre!.id}","op":"eq"}}`
    } else {
      url = `${env.pinataApiHost}/data/pinList?status=pinned&metadata[keyvalues][type]={"value":"music","op":"eq"}`
    }

    const res = await axios.get(url, {
      headers: {
        pinata_api_key: env.pinataApiKey,
        pinata_secret_api_key: env.pinataApiSecret,
      },
    })

    let musicsFromPinata: PinataGetResponse[] = res.data.rows;
    let musicsByGenre: MusicWithMetadata[] = []

    for (const row of musicsFromPinata) {


      //to find the name of the artist, album and genre
      const artistMusic = await userService.findFirst({ id: row.metadata.keyvalues.artistId })
      const albumMusic = await albumService.findMany({ id: row.metadata.keyvalues.albumId })
      const genreMusic = genre ? genre : await genreService.findUnique({ id: row.metadata.keyvalues.genreId })

      musicsByGenre.push({
          musicName: row.metadata.name,
          musicUrl: `${env.pinataGatewayHost}/${row.ipfs_pin_hash}`,
          album: albumMusic[0].name,
          coverUrl: `${env.pinataGatewayHost}/${row.metadata.keyvalues.cover}`,
          genre: genreMusic!.name,
          artist: artistMusic!.username,
          listenings: row.metadata.keyvalues.listenings
      })
    }

    return musicsByGenre
  }
}

const pinataService = new PinataService()

export default pinataService
