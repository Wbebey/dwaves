import axios from 'axios'
import {IPinataService} from "@interfaces/services.interface";
import FormData from 'form-data'
import env from "@config/env.config";
import {ReadStream} from "fs";

const {pinataApiHost, pinataApiKey, pinataApiSecret} = env

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

class PinataService implements IPinataService {
    pinFileToIPFS : (file: ReadStream, metadata: Metadata) => Promise<string> = async (file: ReadStream, metadata: Metadata) => {
    //async function pinFileToIPFS(file: fs.ReadStream, metadata: Metadata) {
        const url = `${pinataApiHost}/pinning/pinFileToIPFS`
        //making axios POST request to Pinata ⬇️
        let data = new FormData();
        data.append('file', file);

        const metadataPinata = JSON.stringify({
            keyvalues: metadata
        });
        data.append('pinataMetadata', metadataPinata);

        //pinataOptions are optional
        const pinataOptions = JSON.stringify({
            cidVersion: 0,
            customPinPolicy: {
                regions: [
                    {
                        id: 'FRA1',
                        desiredReplicationCount: 1
                    },
                    {
                        id: 'NYC1',
                        desiredReplicationCount: 2
                    }
                ]
            }
        });
        data.append('pinataOptions', pinataOptions);

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


}

export default PinataService