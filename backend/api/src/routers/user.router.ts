import { Router } from 'express'

import UserController from '@controllers/user.controller'

const userRouter = Router()
const userController = new UserController()

userRouter.get('/', userController.get)
userRouter.get('/monthlyListenings', userController.getMonthlyListenings)

export default userRouter
