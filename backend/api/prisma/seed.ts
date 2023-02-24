import { Prisma, PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const user1Data: Prisma.UserCreateInput = {
    email: 'user1@example.com',
    username: 'user1',
    password: 'password',
  }
  user1Data.password = await argon2.hash(user1Data.password)
  const user1 = prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: user1Data,
  })

  const artist1Data: Prisma.UserCreateInput = {
    email: 'artist1@example.com',
    username: 'artist1',
    password: 'password',
  }
  artist1Data.password = await argon2.hash(artist1Data.password)
  const artist1 = prisma.user.upsert({
    where: { email: 'artist1@example.com' },
    update: {},
    create: artist1Data,
  })

  const genresData = [
    'pop',
    'rock',
    'hiphop',
    'jazz',
    'classical',
    'kpop',
    'edm',
    'rap',
    'rnb',
    'country',
    'blues',
    'folk',
    'metal',
    'punk',
    'soul',
    'reggae',
    'indie',
    'latin',
    'disco',
    'funk',
    'house',
    'techno',
    'trance',
    'trap',
    'dubstep',
    'drum and bass',
    'hardstyle',
    'hardcore',
    'psytrance',
    'progressive',
    'jpop',
  ]

  for (const genre of genresData) {
    await prisma.genre.upsert({
      where: { name: genre },
      update: {},
      create: { name: genre },
    })
  }

  await Promise.all([user1, artist1])
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
