import express from 'express'
import 'express-async-errors'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import env from '@config/env.config'
import appRouter from '@routers/app.router'
import logger from '@config/logger.config'

import {
  errorLoggerMiddleware,
  requestLoggerMiddleware,
} from '@middlewares/logger.middleware'
import {
  errorResponderMiddleware,
  invalidPathResponderMiddleware,
} from '@middlewares/responder.middleware'

const app = express()
app.disable('x-powered-by')

app.use(
  cors({
    origin: env.frontHost,
    credentials: true,
  })
)
app.use(fileUpload({ createParentPath: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(requestLoggerMiddleware)

app.use('/api/v1', appRouter)

app.use(errorLoggerMiddleware)
app.use(errorResponderMiddleware)
app.use(invalidPathResponderMiddleware)

app.listen(env.port, () => {
  logger.log(`⚡️ Server is running at port ${env.port}`)
})
