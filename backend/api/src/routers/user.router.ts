import { Router } from 'express'

import userController from '@controllers/user.controller'
import currentUserRouter from '@routers/current-user.router'
import { param } from 'express-validator'
import userValidator from '@validators/user.validator'

const userRouter = Router()

userRouter.get('/', userController.get)
userRouter.get('/monthlyListenings', userController.getMonthlyListenings)

userRouter.use('/me', currentUserRouter)
userRouter.get(
  '/:id',
  param('id').customSanitizer(userValidator.toValidUserId),
  userValidator.validate,
  userController.show
)

export default userRouter
