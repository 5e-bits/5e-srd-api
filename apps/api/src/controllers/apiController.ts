import { NextFunction, Request, Response } from 'express'

import Collection from '@/models/2014/collection'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collections = await Collection.find({})

    const colName = req.path.split('/')[1]
    const colRequested = collections.find((col) => col.index === colName)

    if (colRequested === undefined && colName !== '') {
      res.sendStatus(404)
      return
    }

    const queryString = req.originalUrl.split('?')?.[1]
    const redirectUrl = '/api/2014' + req.path
    const urlWithQuery = queryString === undefined ? redirectUrl : redirectUrl + '?' + queryString
    res.redirect(301, urlWithQuery)
  } catch (err) {
    next(err)
  }
}
