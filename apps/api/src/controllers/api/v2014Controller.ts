import { NextFunction, Request, Response } from 'express'

import Collection from '@/models/2014/collection'

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Collection.find({})
      .select({ index: 1, _id: 0 })
      .sort({ index: 'asc' })
      .exec()

    const apiIndex: Record<string, string> = {}
    data.forEach((item) => {
      if (item.index === 'levels') return

      apiIndex[item.index] = `/api/2014/${item.index}`
    })

    return res.status(200).json(apiIndex)
  } catch (err) {
    next(err)
  }
}
