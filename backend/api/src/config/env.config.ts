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
  pinataApiKey: checkEnv('PINATA_API_KEY'),
  pinataApiSecret: checkEnv('PINATA_API_SECRET'),
  pinataApiHost: checkEnv('PINATA_API_HOST'),
  pinataGatewayHost: checkEnv('PINATA_GATEWAY_HOST'),
  dwavesBankPrivateKey: checkEnv('DWAVES_BANK_PRIVATE_KEY'),
  alchemyApiKey: checkEnv('ALCHEMY_API_KEY'),
}

export default config
