import { Router } from 'express'

import MusicController from '@controllers/music.controller'

const musicRouter = Router()
const musicController = new MusicController()

musicRouter.post('/pinSingleMusic', musicController.createSingleMusic)

export default musicRouter
