import { ReturnModelType } from '@typegoose/typegoose'
import { NextFunction, Request, Response } from 'express'

import { NameQuerySchema, ShowParamsSchema } from '@/schemas/schemas'
import { ResourceList } from '@/util/data'
import { escapeRegExp } from '@/util/regex'
import { applyTranslation, applyTranslationToList } from '@/util/translation'

interface IndexQuery {
  name?: { $regex: RegExp }
}

class SimpleController {
  Schema: ReturnModelType<any>

  constructor(Schema: ReturnModelType<any>) {
    this.Schema = Schema
  }

  private get collectionName(): string {
    return this.Schema.collection.name
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = NameQuerySchema.safeParse(req.query)

      if (!validatedQuery.success) {
        return res
          .status(400)
          .json({ error: 'Invalid query parameters', details: validatedQuery.error.issues })
      }

      const { name } = validatedQuery.data
      const lang = req.lang ?? 'en'

      const searchQueries: IndexQuery = {}
      if (name !== undefined) {
        searchQueries.name = { $regex: new RegExp(escapeRegExp(name), 'i') }
      }

      const data = await this.Schema.find(searchQueries)
        .select({ index: 1, name: 1, url: 1, _id: 0 })
        .sort({ index: 'asc' })
        .exec()

      const { docs: translated, wasTranslated } = await applyTranslationToList(
        data.map((d: any) => d.toObject?.() ?? d),
        this.collectionName,
        lang
      )

      res.setHeader('Content-Language', wasTranslated ? lang : 'en')
      return res.status(200).json(ResourceList(translated))
    } catch (err) {
      next(err)
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedParams = ShowParamsSchema.safeParse(req.params)

      if (!validatedParams.success) {
        return res
          .status(400)
          .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
      }

      const { index } = validatedParams.data
      const lang = req.lang ?? 'en'

      const data = await this.Schema.findOne({ index })
      if (data === null) return next()

      const plain = data.toObject?.() ?? data
      const translated = await applyTranslation(plain, this.collectionName, lang)

      res.setHeader('Content-Language', translated !== plain ? lang : 'en')
      res.status(200).json(translated)
    } catch (err) {
      next(err)
    }
  }
}

export default SimpleController
