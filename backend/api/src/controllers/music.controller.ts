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
import nftService from '@services/nft.service'

class MusicController implements IMusicController {

  get: RequestHandler = async (req, res) => {
    const musics = await pinataService.getMusicFromIPFS(req.query)
    res.json(musics)
  }

  uploadSingle: RequestHandler = async (req, res) => {
    const cover = req.files!.cover as UploadedFile
    const coverMetadata: CoverMetadata = { type: FileType.COVER }
    const coverCID = await pinataService.pinFileToIPFS(cover, coverMetadata)

    logger.log(`cover: ${cover.name} - CID: ${coverCID}`)

    const music = req.files!.music as UploadedFile
    const { id: artistId, address: artistAddress } = req.app.locals.user.id
    const name = req.body.name
    const genreId = req.body.genre.id
    const album = await albumService.create({
      name,
      type: AlbumType.SINGLE,
      artist: { connect: { id: artistId } },
      genre: { connect: { id: genreId } },
      coverCID,
    })

    const musicMetadata: MusicMetadata = {
      type: FileType.MUSIC,
      name,
      albumId: album.id,
      artistId,
      genreId,
      listenings: 0,
    }
    const musicCID = await pinataService.pinFileToIPFS(music, musicMetadata)

    logger.log(`music: ${music.name} - CID: ${musicCID}`)

    const coverUrl = `${env.pinataGatewayHost}/${coverCID}`
    const musicUrl = `${env.pinataGatewayHost}/${musicCID}`

    await nftService.mint(artistAddress, musicCID)

    res.json({ coverUrl, musicUrl })
  }

  uploadAlbum: RequestHandler = async (req, res) => {

    const cover = req.files!.cover as UploadedFile
    const musics = req.files!.musics as UploadedFile[]
    const artistId = req.app.locals.user.id
    const { genre, albumName, musicNames } = req.body
    const genreId = genre.id

    //pin Cover on Pinata
    const coverMetadata: CoverMetadata = { type: FileType.COVER }
    const coverCID = await pinataService.pinFileToIPFS(cover, coverMetadata)
    logger.log(`cover: ${cover.name} - CID: ${coverCID}`)
    const coverUrl = `${env.pinataGatewayHost}/${coverCID}`

    //create Album
    const album = await albumService.create({
      name: albumName,
      type: AlbumType.ALBUM,
      artist: { connect: { id: artistId } },
      genre: { connect: { id: genreId } },
    })


    const musicMetadata: MusicMetadata = {
      type: FileType.MUSIC,
      name: 'truc',
      albumId: album.id,
      artistId,
      genreId,
      listenings: 0,
    }

    //pin each musics
    const musicsUrl :string[] = await Promise.all(musics.map(async (music, index) => {

      const musicCID = await pinataService.pinFileToIPFS(music, musicMetadata)
      logger.log(`music: ${music.name} - CID: ${musicCID}`)

      return `musicCID - ${index+1} : ${env.pinataGatewayHost}/${musicCID}`
    }))

    res.json({ musicsUrl })
  }
}

const musicController = new MusicController()

export default musicController
