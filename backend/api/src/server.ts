import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from '../../db/generated/client'

dotenv.config()

const app: Express = express()
const port = process.env.PORT
const prisma = new PrismaClient()

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server 🤯')
})

app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
