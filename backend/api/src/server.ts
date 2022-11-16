import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import config from './config'
import DwavesToken from '@abi/DwavesToken.json'

const { port, appName } = config

const app = express()
const prisma = new PrismaClient()

app.get('/', (req: Request, res: Response) => {
  const ok = '👌OK'
  console.log(`[${appName}]: ${ok}`)
  res.json(ok)
})

app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.get('/token', async (req: Request, res: Response) => {
  res.json({ DwavesToken })
})

app.listen(port, () => {
  console.log(`[${appName}]: ⚡️Server is running at port ${port}`)
})
