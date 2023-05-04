import axios from 'axios'
import { IPinataService } from '@interfaces/service.interface'
import FormData from 'form-data'
import env from '@config/env.config'
import genreService from "@services/genre.service"
import userService from "@services/user.service";
import albumService from "@services/album.service";
import {
  CoverMetadata,
  ViewMusic,
  MusicMetadata,
  MusicQuery,
  PinataPinListResponse,
  PinataPinResponse,
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
    data.append('pinataMetadata',  metadataPinata)
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
  ): Promise<ViewMusic[]> => {

    const {genre} = query

    const baseUrl = `${env.pinataApiHost}/data/pinList?status=pinned&metadata[keyvalues]`
    const filter = {type:{value:'music',op:'eq'}}
    const url = genre
        ? `${baseUrl}=${JSON.stringify({...filter, genreId: {value: genre.id, op: 'eq'}})}`
        : `${baseUrl}=${JSON.stringify(filter)}`


    const res = await axios.get<PinataPinListResponse>(url, {
      headers: {
        pinata_api_key: env.pinataApiKey,
        pinata_secret_api_key: env.pinataApiSecret,
      },
    })


    let albumIds : number[] = []
    let artistIds : number[] = []
    let genreIds : number[] = []

    for (const music of res.data.rows) {
      albumIds.push(music.metadata.keyvalues.albumId)
      artistIds.push(music.metadata.keyvalues.artistId)
      genreIds.push(music.metadata.keyvalues.genreId)
    }
    albumIds = [...new Set(albumIds)]
    artistIds = [...new Set(artistIds)]
    genreIds = [...new Set(genreIds)]

    const albums = await albumService.findMany({id: { in: albumIds}})
    const artists = await userService.findMany({id: { in: artistIds}})
    const genres = genre ? [genre] : await genreService.findMany({id: {in: genreIds}})

    const allMusics = res.data.rows.map(music => {
      return {
        name: music.metadata.name,
        src: `${env.pinataGatewayHost}/${music.ipfs_pin_hash}`,
        albumName: albums.find(x => x.id === music.metadata.keyvalues.albumId)?.name || '',
        genreName: genres.find(x => x.id === music.metadata.keyvalues.genreId)?.name || '',
        artistName: artists.find(x => x.id === music.metadata.keyvalues.artistId)?.username || '',
        listenings: music.metadata.keyvalues.listenings
      }
    })

    return allMusics
  }
}

const pinataService = new PinataService()

export default pinataService
