import { Router } from 'express'

import musicController from '@controllers/music.controller'

const musicRouter = Router()

musicRouter.get('/getAllMusicByGenre', musicController.getAllMusicByGenre)
musicRouter.post('/pinSingleMusic', musicController.createSingleMusic)

export default musicRouter
