import { getReasonPhrase, ReasonPhrases, StatusCodes } from 'http-status-codes'

class AppError extends Error {
  public code: StatusCodes
  public status: ReasonPhrases

  constructor(message: string, code: StatusCodes) {
    super(message)

    this.code = code
    this.status = getReasonPhrase(code) as ReasonPhrases

    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
