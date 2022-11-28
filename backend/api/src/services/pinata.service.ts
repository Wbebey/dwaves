import axios from 'axios'
import { IPinataService } from '@interfaces/service.interface'
import FormData from 'form-data'
import env from '@config/env.config'
import {
  CoverMetadata,
  MusicMetadata,
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

    const coverCID = res.data.IpfsHash

    return coverCID
  }
}

const pinataService = new PinataService()

export default pinataService
