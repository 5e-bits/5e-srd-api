import { NextFunction, Request, Response } from 'express'

const HSTS_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export default function httpsRedirect(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV !== 'production') return next()

  if (!req.secure) {
    return res.redirect(301, `https://${req.hostname}${req.originalUrl}`)
  }

  res.setHeader('Strict-Transport-Security', `max-age=${HSTS_MAX_AGE_SECONDS}`)
  next()
}
