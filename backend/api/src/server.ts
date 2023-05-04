import express from 'express'
import fileUpload from 'express-fileupload'
import bodyParser from 'body-parser'

import env from '@config/env.config'
import appRouter from '@routers/app.router'
import logger from '@config/logger.config'

const { port, appName } = env

const app = express()
app.disable("x-powered-by")

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(appRouter)



app.listen(port, () => {
    logger.log(`[${appName}]: ⚡️Server is running at port ${port}`)
})
