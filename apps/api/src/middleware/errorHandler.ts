import { NextFunction, Request, Response } from 'express'

 
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack)

  // A response already started; Express's default handler closes the connection.
  if (res.headersSent) return next(err)

  const candidate = err.status ?? err.statusCode
  const statusCode =
    Number.isInteger(candidate) && candidate >= 400 && candidate < 600 ? candidate : 500
  res.status(statusCode).json({
    // Server error messages can carry internals (database errors), so only send 4xx ones.
    message: statusCode >= 500 ? 'Internal Server Error' : err.message
  })
}

export default errorHandler
