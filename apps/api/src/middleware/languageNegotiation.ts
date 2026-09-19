import { NextFunction, Request, Response } from 'express'

declare module 'express-serve-static-core' {
  interface Request {
    lang: string
  }
}

export const LOCALE_PATTERN =
  /^(?:(?:en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE|art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang)|(?:(?:[A-Za-z]{2,3}(?:-[A-Za-z]{3}(?:-[A-Za-z]{3}){0,2})?)|[A-Za-z]{4}|[A-Za-z]{5,8})(?:-[A-Za-z]{4})?(?:-(?:[A-Za-z]{2}|[0-9]{3}))?(?:-(?:[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(?:-(?:[0-9A-WY-Za-wy-z](?:-[A-Za-z0-9]{2,8})+))*(?:-x(?:-[A-Za-z0-9]{1,8})+)?|x(?:-[A-Za-z0-9]{1,8})+)$/

function parseLang(raw: string | undefined): string | null {
  if (raw === undefined || raw === '') return null
  const tag = raw.trim().split(',')[0].split(';')[0].trim()
  if (tag === '') return null
  return LOCALE_PATTERN.test(tag) ? tag : null
}

export default function languageNegotiation(req: Request, _res: Response, next: NextFunction) {
  const fromQuery = parseLang(req.query.lang as string | undefined)
  const fromHeader = parseLang(req.headers['accept-language'])
  req.lang = fromQuery ?? fromHeader ?? 'en'
  next()
}
