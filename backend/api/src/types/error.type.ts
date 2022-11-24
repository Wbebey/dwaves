import { RequestHandler } from 'express'

export type AsyncMiddleware<T> = (...p: Parameters<RequestHandler>) => Promise<T>

export type AsyncErrorHandler<T> = (f: AsyncMiddleware<T>) => RequestHandler
