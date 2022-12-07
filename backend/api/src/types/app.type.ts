import { RequestHandler } from 'express'
import { AlbumFilter } from '@@types/album.type'

export type AlbumGetRequestHandler = RequestHandler<{}, {}, {}, AlbumFilter>
