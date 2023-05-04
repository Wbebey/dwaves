import { Router } from 'express'

import AlbumController from '@controllers/album.controller'

const albumRouter = Router()
const albumController = new AlbumController()

albumRouter.get('/', albumController.get)
albumRouter.post('/', albumController.create)

export default albumRouter
