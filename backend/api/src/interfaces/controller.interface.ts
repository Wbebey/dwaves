import {
  AlbumGetRequestHandler,
  MusicListRequestHandler,
} from '@@types/app.type'
import { Genre } from '@prisma/client'
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
  updateInfo: RequestHandler
  updatePassword: RequestHandler
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
