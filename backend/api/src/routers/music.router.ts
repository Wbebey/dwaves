import { Router } from 'express'

import musicController from '@controllers/music.controller'

const musicRouter = Router()

musicRouter.post('/pinSingleMusic', musicController.createSingleMusic)

export default musicRouter
