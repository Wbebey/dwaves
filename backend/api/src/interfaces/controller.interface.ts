import { RequestHandler } from 'express'

interface IController {}

export interface IAppController extends IController {
  healthcheck: RequestHandler
}

export interface IUserController extends IController {
  get: RequestHandler
}
