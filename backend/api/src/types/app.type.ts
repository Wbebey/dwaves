import { RequestHandler } from 'express'
import { AlbumFilter } from '@@types/album.type'
import { MusicFilter, PopularMusicFilter } from '@@types/pinata.type'
import { PlaylistFilter } from './playlist.type'

export type AlbumGetRequestHandler = RequestHandler<{}, {}, {}, AlbumFilter>
export type PlaylistGetRequestHandler = RequestHandler<
  {},
  {},
  {},
  PlaylistFilter
>
export type MusicListRequestHandler = RequestHandler<{}, {}, {}, MusicFilter>
export type PopularMusicRequestHandler = RequestHandler<
  {},
  {},
  {},
  PopularMusicFilter
>
export type LimitRequestHandler = RequestHandler<{}, {}, {}, { limit?: number }>
