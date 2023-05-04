import config from '@config/env.config'
import { ITokenService } from '@interfaces/service.interface'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

class TokenService implements ITokenService {
  signJwt = (payload: JwtPayload, options: SignOptions = {}) => {
    const privateKey = Buffer.from(config.jwtPrivateKey, 'base64').toString(
      'ascii'
    )
    return jwt.sign(payload, privateKey, { ...options, algorithm: 'RS256' })
  }

  verifyJwt = <T>(token: string): T | null => {
    try {
      const publicKey = Buffer.from(config.jwtPublicKey, 'base64').toString(
        'ascii'
      )
      return jwt.verify(token, publicKey) as T
    } catch (error) {
      return null
    }
  }
}

const tokenService = new TokenService()

export default tokenService
