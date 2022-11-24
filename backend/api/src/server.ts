import express from 'express'
import fileUpload from 'express-fileupload'
import bodyParser from 'body-parser'
import cors from 'cors'

import config from '@config/env.config'
import appRouter from '@routers/app.router'
import logger from '@config/logger.config'

const { port, frontHost } = config
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

app.use(cors({ origin: frontHost }))
app.use(fileUpload({ createParentPath: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(requestLoggerMiddleware)

app.use('/api/v1', appRouter)

app.use(errorLoggerMiddleware)
app.use(errorResponderMiddleware)
app.use(invalidPathResponderMiddleware)

app.listen(port, () => {
  logger.log(`⚡️ Server is running at env.port ${port}`)
})
