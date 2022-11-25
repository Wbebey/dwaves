import { Router } from 'express'

import userController from '@controllers/user.controller'

const userRouter = Router()

userRouter.get('/', userController.get)
userRouter.get('/me', userController.me)
userRouter.get('/monthlyListenings', userController.getMonthlyListenings)

export default userRouter
