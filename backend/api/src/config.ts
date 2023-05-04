import dotenv from 'dotenv'

dotenv.config()

const checkEnv = (variable: string): string => {
  const envVariable = process.env[variable]
  if (!envVariable) {
    throw new Error(`Couldn't find environment variable: ${variable}`)
  }
  return envVariable
}

const config = {
  appName: checkEnv('APP_NAME'),
  port: checkEnv('PORT'),
  postgresUrl: checkEnv('POSTGRES_URL'),
}

export default config
