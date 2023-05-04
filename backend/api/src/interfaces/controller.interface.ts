import { RequestHandler } from 'express'

interface IController {}

export interface IAppController extends IController {
  healthcheck: RequestHandler
}

export interface IUserController extends IController {
  get: RequestHandler
  me: RequestHandler
  getMonthlyListenings: RequestHandler
}

export interface IAlbumController extends IController {
  get: RequestHandler
  create: RequestHandler
}

export interface IGenreController extends IController {
  get: RequestHandler
  create: RequestHandler
}

export interface IMusicController extends IController {
  uploadSingle: RequestHandler
}

export interface IAuthController extends IController {
  register: RequestHandler
  login: RequestHandler
  logout: RequestHandler
  refresh: RequestHandler
}
