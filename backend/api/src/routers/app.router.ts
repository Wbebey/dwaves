import { Router } from 'express'

import userRouter from '@routers/user.router'
import albumRouter from '@routers/album.router'
import musicRouter from '@routers/music.router'
import authRouter from '@routers/auth.router'
import genreRouter from '@routers/genre.router'
import appController from '@controllers/app.controller'
import { deserializeUser, requireUser } from '@middlewares/auth.middleware'

const appRouter = Router()

appRouter.get('/', appController.healthcheck)
appRouter.use('/auth', authRouter)

appRouter.use(deserializeUser, requireUser)

appRouter.use('/users', userRouter)
appRouter.use('/albums', albumRouter)
appRouter.use('/musics', musicRouter)
appRouter.use('/genres', genreRouter)

export default appRouter
