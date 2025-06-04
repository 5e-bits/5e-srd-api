import { NextFunction, Request, Response } from 'express'

/* eslint-disable @typescript-eslint/no-unused-vars */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack)

  const statusCode = typeof err.status === 'number' ? err.status : 404
  res.status(statusCode).json({
    message: err.message
  })
}

export default errorHandler
