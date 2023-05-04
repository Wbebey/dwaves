import { KeyType, TokenType } from '@@types/token.type'
import config from '@config/env.config'
import logger from '@config/logger.config'
import AppError from '@errors/app.error'
import { ITokenService } from '@interfaces/service.interface'
import { StatusCodes } from 'http-status-codes'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

class TokenService implements ITokenService {
  signJwt = (
    payload: JwtPayload,
    tokenType: TokenType,
    options: SignOptions = {}
  ) => {
    const privateKey = Buffer.from(
      getKey(tokenType, KeyType.PRIVATE),
      'base64'
    ).toString('ascii')

    return jwt.sign(payload, privateKey, {
      ...options,
      algorithm: 'RS256',
    })
  }

  verifyJwt = <T>(token: string, tokenType: TokenType): T | null => {
    try {
      const publicKey = Buffer.from(
        getKey(tokenType, KeyType.PUBLIC),
        'base64'
      ).toString('ascii')
      return jwt.verify(token, publicKey) as T
    } catch (error) {
      logger.error(error as Error)
      return null
    }
  }
}

const getKey = (tokenType: TokenType, keyType: KeyType): string => {
  const typeToKey = {
    access: {
      private: config.accessTokenPrivateKey,
      public: config.accessTokenPublicKey,
    },
    refresh: {
      private: config.refreshTokenPrivateKey,
      public: config.refreshTokenPublicKey,
    },
  }

  return typeToKey[tokenType][keyType]
}

const tokenService = new TokenService()

export default tokenService
