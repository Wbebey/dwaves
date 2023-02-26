import { RequestHandler } from 'express'
import { IMusicController } from '@interfaces/controller.interface'
import env from '@config/env.config'
import { UploadedFile } from 'express-fileupload'
import logger from '@config/logger.config'
import pinataService from '@services/pinata.service'
import { FileType, MusicMetadata, ViewMusic } from '@@types/pinata.type'
import albumService from '@services/album.service'
import { AlbumType } from '@prisma/client'
import nftService from '@services/nft.service'
import {
  MusicListRequestHandler,
  PopularMusicRequestHandler,
} from '@@types/app.type'
import userService from '@services/user.service'
import genreService from '@services/genre.service'

class MusicController implements IMusicController {
  get: MusicListRequestHandler = async (req, res) => {
    const { artistId, genre } = req.query
    const musics = await pinataService.getMusicFromIPFS({ genre, artistId })
    res.json(musics)
  }

  getPopular: PopularMusicRequestHandler = async (req, res) => {
    const { artistId, genre, limit } = req.query
    const musics = await pinataService.getMusicFromIPFS({ genre, artistId })

    const popularMusics = musics
      .sort((a, b) => b.listenings - a.listenings)
      .slice(0, limit || 10)

    //* Don't parallelize promises to not instantiate too many db connections
    const viewMusics = []
    for await (const music of popularMusics.map(this._toViewMusic)) {
      viewMusics.push(music)
    }

    res.json(viewMusics)
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

      return musicCID
    })
    const musicCIDs = await Promise.all(uploads)

    await nftService.batchMint(artistAddress, musicCIDs)

    const musicUrls = musicCIDs.map((cid) => `${env.pinataGatewayHost}/${cid}`)
    const coverUrl = `${env.pinataGatewayHost}/${createdAlbum.coverCID}`

    res.json({ coverUrl, musicUrls })
  }

  incrementListeningsMetadata: RequestHandler = async (req, res) => {
    const { musicCID, listeningsValue } = req.body
    const resPinata = await pinataService.updateListeningsMetadata(
      musicCID,
      listeningsValue
    )

    res.json(resPinata)
  }

  private _toViewMusic = async (music: ViewMusic) => {
    const { artistId, genreId, albumId, ...rest } = music

    const [artist, genre, album] = await Promise.all([
      userService.findUnique({ id: artistId }),
      genreService.findUnique({ id: genreId }),
      albumService.findUnique({ id: albumId }),
    ])

    return {
      ...rest,
      artist: artist?.username || 'Unknown',
      genre: genre?.name || 'Unknown',
      album: album?.name || 'Unknown',
    }
  }
}

const musicController = new MusicController()

export default musicController
