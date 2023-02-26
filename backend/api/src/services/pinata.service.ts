import axios from 'axios'
import { IPinataService } from '@interfaces/service.interface'
import FormData from 'form-data'
import env from '@config/env.config'
import {
  CoverMetadata,
  MusicFilter,
  MusicMetadata,
  PinataPinListResponse,
  PinataPinResponse,
  PinataQueryFilter,
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

  getMusicFromIPFS = async (musicFilter: MusicFilter) => {
    const { genre, albumId, artistId } = musicFilter
    const baseUrl = `${env.pinataApiHost}/data/pinList?status=pinned&metadata[keyvalues]`

    let filter: PinataQueryFilter = { type: { value: 'music', op: 'eq' } }
    if (genre) {
      filter.genreId = { value: genre.id.toString(), op: 'eq' }
    }
    if (albumId) {
      filter.albumId = { value: albumId.toString(), op: 'eq' }
    }
    if (artistId) {
      filter.artistId = { value: artistId.toString(), op: 'eq' }
    }

    const url = `${baseUrl}=${JSON.stringify(filter)}`

    const res = await axios.get<PinataPinListResponse>(url, {
      headers: {
        pinata_api_key: env.pinataApiKey,
        pinata_secret_api_key: env.pinataApiSecret,
      },
    })

    const musics = res.data.rows.map((music) => ({
      ...music.metadata.keyvalues,
      src: `${env.pinataGatewayHost}/${music.ipfs_pin_hash}`,
    }))

    return musics
  }

  updateListeningsMetadata = async (
    musicCID: string,
    newListeningsValue: number
  ) => {
    const url = `${env.pinataApiHost}/pinning/hashMetadata`

    const data = {
      ipfsPinHash: musicCID,
      keyvalues: {
        listenings: newListeningsValue,
      },
    }

    const res = await axios.put(url, data, {
      headers: {
        pinata_api_key: env.pinataApiKey,
        pinata_secret_api_key: env.pinataApiSecret,
      },
    })

    return res.data
  }
}

const pinataService = new PinataService()

export default pinataService
