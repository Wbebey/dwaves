import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from '../client'

dotenv.config()

const app: Express = express()
const { HOSTNAME, PORT } = process.env
const prisma = new PrismaClient()

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server 🤯')
})

app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://${HOSTNAME}:${PORT}`)
})
