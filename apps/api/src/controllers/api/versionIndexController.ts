import { ReturnModelType } from '@typegoose/typegoose'
import { NextFunction, Request, Response } from 'express'

/** Index of the resources available under `/api/<year>`. */
export const versionIndex =
  (year: '2014' | '2024', Collection: ReturnModelType<any>) =>
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Collection.find({})
        .select({ index: 1, _id: 0 })
        .sort({ index: 'asc' })
        .exec()

      const apiIndex: Record<string, string> = {}
      data.forEach((item: { index: string }) => {
        if (item.index === 'levels') return

        apiIndex[item.index] = `/api/${year}/${item.index}`
      })

      return res.status(200).json(apiIndex)
    } catch (err) {
      next(err)
    }
  }
