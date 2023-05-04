import express from 'express'

import env from '@config/env.config'
import appRouter from '@routers/app.router'
import logger from '@config/logger.config'

const { port, appName } = env

const app = express()

app.use(appRouter)

app.listen(port, () => {
  logger.log(`[${appName}]: ⚡️Server is running at port ${port}`)
})
