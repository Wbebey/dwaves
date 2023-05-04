import { Router } from 'express'

import userRouter from '@routers/user.router'
import albumRouter from '@routers/album.router'
import musicRouter from '@routers/music.router'
import authRouter from '@routers/auth.router'
import appController from '@controllers/app.controller'

const appRouter = Router()

appRouter.get('/', appController.healthcheck)
appRouter.use('/users', userRouter)
appRouter.use('/albums', albumRouter)
appRouter.use('/musics', musicRouter)

appRouter.use('/auth', authRouter)

export default appRouter
