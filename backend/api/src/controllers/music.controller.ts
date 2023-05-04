import { RequestHandler } from 'express'
import { IMusicController } from '@interfaces/controller.interface'
import env from '@config/env.config'
import { UploadedFile } from 'express-fileupload'
import logger from '@config/logger.config'
import pinataService from '@services/pinata.service'
import { CoverMetadata, FileType, MusicMetadata } from '@@types/pinata.type'
import albumService from '@services/album.service'
import { AlbumType } from '@prisma/client'
import path from 'path'

class MusicController implements IMusicController {
  uploadSingle: RequestHandler = async (req, res) => {
    const cover = req.files!.cover as UploadedFile
    const coverMetadata: CoverMetadata = { type: FileType.COVER }
    const coverCID = await pinataService.pinFileToIPFS(cover, coverMetadata)

    logger.log(`cover: ${cover.name} - CID: ${coverCID}`)

    const music = req.files!.music as UploadedFile
    const artistId = res.locals.user.id
    const genreId = req.body.genre.id
    const album = await albumService.create({
      name: path.parse(music.name).name,
      type: AlbumType.SINGLE,
      artist: { connect: { id: artistId } },
      genre: { connect: { id: genreId } },
    })

    const musicMetadata: MusicMetadata = {
      type: FileType.MUSIC,
      albumId: album.id,
      artistId,
      genreId,
      listenings: 0,
    }
    const musicCID = await pinataService.pinFileToIPFS(music, musicMetadata)

    logger.log(`music: ${music.name} - CID: ${musicCID}`)

    const coverUrl = `${env.pinataGatewayHost}/${coverCID}`
    const musicUrl = `${env.pinataGatewayHost}/${musicCID}`

    res.json({ coverUrl, musicUrl })
  }
}

const musicController = new MusicController()

export default musicController
