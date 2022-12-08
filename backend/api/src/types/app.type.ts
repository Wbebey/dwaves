import { RequestHandler } from 'express'
import { AlbumFilter } from '@@types/album.type'
import { MusicFilter } from '@@types/pinata.type'

export type AlbumGetRequestHandler = RequestHandler<{}, {}, {}, AlbumFilter>
export type MusicListRequestHandler = RequestHandler<{}, {}, {}, MusicFilter>
