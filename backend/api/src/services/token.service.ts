import { KeyType, TokenType } from '@@types/token.type'
import env from '@config/env.config'
import logger from '@config/logger.config'
import { ITokenService } from '@interfaces/service.interface'
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
      private: env.accessTokenPrivateKey,
      public: env.accessTokenPublicKey,
    },
    refresh: {
      private: env.refreshTokenPrivateKey,
      public: env.refreshTokenPublicKey,
    },
  }

  return typeToKey[tokenType][keyType]
}

const tokenService = new TokenService()

export default tokenService
