import { Router } from 'express'

import userController from '@controllers/user.controller'
import currentUserRouter from './current-user.router'

const userRouter = Router()

userRouter.get('/', userController.get)
userRouter.get('/monthlyListenings', userController.getMonthlyListenings)

userRouter.use('/me', currentUserRouter)

export default userRouter
