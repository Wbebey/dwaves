import { RequestHandler } from 'express'
import { IMusicController } from '@interfaces/controller.interface'
import env from '@config/env.config'
import { UploadedFile } from 'express-fileupload'
import logger from '@config/logger.config'
import pinataService from '@services/pinata.service'
import { FileType, MusicMetadata } from '@@types/pinata.type'
import albumService from '@services/album.service'
import { AlbumType } from '@prisma/client'
import nftService from '@services/nft.service'

class MusicController implements IMusicController {
  get: RequestHandler = async (req, res) => {
    const musics = await pinataService.getMusicFromIPFS(req.query)
    res.json(musics)
  }

  uploadSingle: RequestHandler = async (req, res) => {
    const cover = req.files!.cover as UploadedFile
    const music = req.files!.music as UploadedFile
    const { id: artistId, address: artistAddress } = req.app.locals.user
    const { name, genre } = req.body

    const album = {
      name,
      type: AlbumType.SINGLE,
      artist: { connect: { id: artistId } },
      genre: { connect: { id: genre.id } },
    }
    const createdAlbum = await albumService.create(album, cover)

    const musicMetadata: MusicMetadata = {
      type: FileType.MUSIC,
      name,
      albumId: createdAlbum.id,
      artistId,
      genreId: genre.id,
      listenings: 0,
    }
    const musicCID = await pinataService.pinFileToIPFS(music, musicMetadata)

    logger.log(`music: ${music.name} - CID: ${musicCID}`)

    await nftService.mint(artistAddress, musicCID)

    const coverUrl = `${env.pinataGatewayHost}/${createdAlbum.coverCID}`
    const musicUrl = `${env.pinataGatewayHost}/${musicCID}`

    res.json({ coverUrl, musicUrl })
  }

  uploadAlbum: RequestHandler = async (req, res) => {
    const cover = req.files!.cover as UploadedFile
    const musics = req.files!.musics as UploadedFile[]
    const { id: artistId, address: artistAddress } = req.app.locals.user
    const { genre, albumName, musicNames } = req.body

    const album = {
      name: albumName,
      type: AlbumType.ALBUM,
      artist: { connect: { id: artistId } },
      genre: { connect: { id: genre.id } },
    }
    const createdAlbum = await albumService.create(album, cover)

    const musicMetadata: MusicMetadata = {
      type: FileType.MUSIC,
      name: '',
      albumId: createdAlbum.id,
      artistId,
      genreId: genre.id,
      listenings: 0,
    }

    const uploads = musics.map(async (music, index) => {
      musicMetadata.name = musicNames[index]
      const musicCID = await pinataService.pinFileToIPFS(music, musicMetadata)

      logger.log(`music: ${music.name} - CID: ${musicCID}`)

      await nftService.mint(artistAddress, musicCID)

      return `${env.pinataGatewayHost}/${musicCID}`
    })
    const musicsUrl = await Promise.all(uploads)
    const coverUrl = `${env.pinataGatewayHost}/${createdAlbum.coverCID}`

    res.json({ coverUrl, musicsUrl })
  }
}

const musicController = new MusicController()

export default musicController
