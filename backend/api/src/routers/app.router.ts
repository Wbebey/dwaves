import { Router } from 'express'

import AppController from '@controllers/app.controller'
import userRouter from './user.router'

const appRouter = Router()
const appController = new AppController()

appRouter.get('/', appController.healthcheck)
appRouter.use('/users', userRouter)

export default appRouter
