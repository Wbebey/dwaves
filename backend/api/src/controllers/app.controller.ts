import { RequestHandler } from 'express'

import { IAppController } from '@interfaces/controller.interface'

class AppController implements IAppController {
  healthcheck: RequestHandler = (_, res) => {
    res.json('👌OK')
  }
}

const appController = new AppController()

export default appController
