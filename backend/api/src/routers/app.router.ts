import { Router } from 'express'

import AppController from '@controllers/app.controller'
import userRouter from '@routers/user.router'
import albumRouter from '@routers/album.router'
import PinataRouter from '@routers/music.router'

const appRouter = Router()
const appController = new AppController()

appRouter.get('/', appController.healthcheck)
appRouter.use('/users', userRouter)
appRouter.use('/albums', albumRouter)
appRouter.use('/musics', PinataRouter)


export default appRouter
