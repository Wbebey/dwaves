import {
  AlbumGetRequestHandler,
  LimitRequestHandler,
  MusicListRequestHandler,
  PlaylistGetRequestHandler,
} from '@@types/app.type'
import { RequestHandler } from 'express'

interface IController {}

export interface IAppController extends IController {
  healthcheck: RequestHandler
}

export interface IUserController extends IController {
  get: RequestHandler
  me: RequestHandler
  addWallet: RequestHandler
  getMonthlyListenings: RequestHandler
  getMyPopularMusics: LimitRequestHandler
  getMyAlbums: RequestHandler
  getMyPlaylists: RequestHandler
  getMyLikedMusics: RequestHandler
  createPlaylist: RequestHandler
  updateInfo: RequestHandler
  updatePassword: RequestHandler
  updateLikedMusics: RequestHandler
}

export interface IAlbumController extends IController {
  list: AlbumGetRequestHandler
  show: RequestHandler
  create: RequestHandler
  delete: RequestHandler
}

export interface IGenreController extends IController {
  get: RequestHandler
  create: RequestHandler
}

export interface IMusicController extends IController {
  get: MusicListRequestHandler
  getPopular: RequestHandler
  uploadSingle: RequestHandler
  uploadAlbum: RequestHandler
  incrementListeningsMetadata: RequestHandler
}

export interface IAuthController extends IController {
  register: RequestHandler
  login: RequestHandler
  logout: RequestHandler
  refresh: RequestHandler
}

export interface IPlaylistController extends IController {
  list: PlaylistGetRequestHandler
  show: RequestHandler
  create: RequestHandler
  update: RequestHandler
  delete: RequestHandler
}

export interface IEventController extends IController {
  createConcertEvent: RequestHandler
  buyTicket: RequestHandler
}
