import { Router } from 'express'

import AppController from '@controllers/app.controller'
import userRouter from './user.router'
import albumRouter from './album.router'
import PinataRouter from './music.router'

const appRouter = Router()
const appController = new AppController()

appRouter.get('/', appController.healthcheck)
appRouter.use('/users', userRouter)
appRouter.use('/albums', albumRouter)
appRouter.use('/music', PinataRouter)


export default appRouter
