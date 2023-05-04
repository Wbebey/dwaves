import { RequestHandler } from 'express'
import { IMusicController } from '@interfaces/controller.interface'
import env from '@config/env.config'
import fs from "fs";

const { pinataGatewayHost } = env

import PinataService from '@services/pinata.service'
const pinataService = new PinataService()

class MusicController implements IMusicController  {
    createSingleMusic: RequestHandler = async (req, res) => {
        if (!req.files || !req.body) {
            res.status(400).send({
                status: false,
                message: 'No file or metadata uploaded'
            })
            return
        }
        let musicMetadata = JSON.parse(req.body.request)
        // Use the name of the input field (i.e. "cover") to retrieve the uploaded file
        let cover: any = req.files.cover
        let music: any = req.files.music

        await cover.mv('./src/services/uploadsFile/' + cover.name)
        const coverCID = await pinataService.pinFileToIPFS(fs.createReadStream('./src/services/uploadsFile/' + cover.name), {type: 'cover'})
        console.log('cover : ', cover.name, ' - coverCID : ', coverCID)

        musicMetadata.album = music.name + ' - Single'
        musicMetadata.cover = coverCID
        musicMetadata.type = 'music'
        musicMetadata.listenings = 0

        await music.mv('./src/services/uploadsFile/' + music.name)
        const musicCID = await pinataService.pinFileToIPFS(fs.createReadStream('./src/services/uploadsFile/' + music.name), musicMetadata)
        console.log('music : ', music.name, ' - musicCID : ', musicCID)

        fs.rmSync('./src/services/uploadsFile/', {recursive: true});

        res.json(pinataGatewayHost + '/' + musicCID)
    }
}

export default MusicController