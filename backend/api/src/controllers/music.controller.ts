import { RequestHandler } from 'express'
import { IMusicController } from '@interfaces/controller.interface'
import env from '@config/env.config'
import { UploadedFile } from 'express-fileupload'
import logger from '@config/logger.config'
import fs from 'fs'
import pinataService from '@services/pinata.service'

class MusicController implements IMusicController {
  createSingleMusic: RequestHandler = async (req, res) => {
    if (!req.files || !req.body) {
      res.status(400).send({
        status: false,
        message: 'No file or metadata uploaded',
      })
      return
    }
    const musicMetadata = JSON.parse(req.body.request)
    // Use the name of the input field (i.e. "cover") to retrieve the uploaded file
    const cover = req.files.cover as UploadedFile
    const music = req.files.music as UploadedFile

    const pathUploadsFilesDirectory = './src/services/uploadsFile/'

    await cover.mv(pathUploadsFilesDirectory + cover.name)
    const coverCID = await pinataService.pinFileToIPFS(
      fs.createReadStream(pathUploadsFilesDirectory + cover.name),
      { type: 'cover' }
    )
    logger.log(`cover : ${cover.name} - coverCID : ${coverCID}`)

    musicMetadata.album = music.name + ' - Single'
    musicMetadata.cover = coverCID
    musicMetadata.type = 'music'
    musicMetadata.listenings = 0

    await music.mv(pathUploadsFilesDirectory + music.name)
    const musicCID = await pinataService.pinFileToIPFS(
      fs.createReadStream(pathUploadsFilesDirectory + music.name),
      musicMetadata
    )
    logger.log(`music : ${music.name} - musicCID : ${musicCID}`)

    fs.rmSync(pathUploadsFilesDirectory, { recursive: true })

    res.json(env.pinataGatewayHost + '/' + musicCID)
  }
}

const musicController = new MusicController()

export default musicController
