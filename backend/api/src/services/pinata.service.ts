import axios from 'axios'
import { IPinataService } from '@interfaces/service.interface'
import FormData from 'form-data'
import env from '@config/env.config'
import { ReadStream } from 'fs'
import { IPFSMetadata, PinataPinResponse } from '@@types/pinata.type'

class PinataService implements IPinataService {
  pinFileToIPFS = async (file: ReadStream, metadata: IPFSMetadata) => {
    const url = `${env.pinataApiHost}/pinning/pinFileToIPFS`

    let data = new FormData()
    const metadataPinata = JSON.stringify({ keyvalues: metadata })
    data.append('pinataMetadata', metadataPinata)
    data.append('file', file)

    const res = await axios.post<PinataPinResponse>(url, data, {
      headers: {
        'Content-Type': `multipart/form-data`,
        pinata_api_key: `${env.pinataApiKey}`,
        pinata_secret_api_key: `${env.pinataApiSecret}`,
      },
    })

    const coverCID = res.data.IpfsHash

    return coverCID
  }
}

const pinataService = new PinataService()

export default pinataService
