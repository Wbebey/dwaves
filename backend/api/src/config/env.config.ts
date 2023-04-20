import dotenv from 'dotenv'

dotenv.config()

const checkEnv = <T = string>(variable: string): T => {
  const envVariable = process.env[variable]
  if (!envVariable) {
    throw new Error(`Couldn't find environment variable: ${variable}`)
  }
  return envVariable as T
}

const env = {
  appName: checkEnv('APP_NAME'),
  port: checkEnv<number>('PORT'),
  frontHost: checkEnv('FRONT_HOST'),
  postgresUrl: checkEnv('POSTGRES_URL'),
  pinataApiKey: checkEnv('PINATA_API_KEY'),
  pinataApiSecret: checkEnv('PINATA_API_SECRET'),
  pinataApiHost: checkEnv('PINATA_API_HOST'),
  pinataGatewayHost: checkEnv('PINATA_GATEWAY_HOST'),
  dwavesPayerPrivateKey: checkEnv('DWAVES_PAYER_PRIVATE_KEY'),
  alchemyApiKey: checkEnv('ALCHEMY_API_KEY'),
  accessTokenPrivateKey: checkEnv('ACCESS_TOKEN_PRIVATE_KEY'),
  accessTokenPublicKey: checkEnv('ACCESS_TOKEN_PUBLIC_KEY'),
  refreshTokenPrivateKey: checkEnv('REFRESH_TOKEN_PRIVATE_KEY'),
  refreshTokenPublicKey: checkEnv('REFRESH_TOKEN_PUBLIC_KEY'),
  accessTokenExp: checkEnv<number>('ACCESS_TOKEN_EXP'),
  refreshTokenExp: checkEnv<number>('REFRESH_TOKEN_EXP'),
  googleApplicationCredentials: checkEnv('GOOGLE_APPLICATION_CREDENTIALS'),
  gcsImageBucketName: checkEnv('GCS_IMAGE_BUCKET_NAME'),
}

export default env
