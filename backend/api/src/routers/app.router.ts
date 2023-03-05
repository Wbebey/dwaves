import { Router } from 'express'

import { deserializeUser } from '@middlewares/auth.middleware'
import userRouter from '@routers/user.router'
import albumRouter from '@routers/album.router'
import musicRouter from '@routers/music.router'
import authRouter from '@routers/auth.router'
import genreRouter from '@routers/genre.router'
import appController from '@controllers/app.controller'
import playlistRouter from './playlist.router'

const appRouter = Router()

appRouter.get('/', appController.healthcheck)
appRouter.use('/auth', authRouter)

appRouter.use(deserializeUser)

appRouter.use('/users', userRouter)
appRouter.use('/albums', albumRouter)
appRouter.use('/musics', musicRouter)
appRouter.use('/genres', genreRouter)
appRouter.use('/playlists', playlistRouter)

export default appRouter
