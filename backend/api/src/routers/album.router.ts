import { Router } from 'express'

import albumController from '@controllers/album.controller'

const albumRouter = Router()

albumRouter.get('/', albumController.get)
albumRouter.post('/', albumController.create)

export default albumRouter
