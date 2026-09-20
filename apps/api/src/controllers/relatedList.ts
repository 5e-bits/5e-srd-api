import { ReturnModelType } from '@typegoose/typegoose'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

import { parseRequest } from '@/controllers/parseRequest'
import { ShowParamsSchema } from '@/schemas/schemas'
import { ResourceList } from '@/util/data'
import { applyTranslationToList } from '@/util/translation'

interface RelatedListOptions<P extends z.ZodType<{ index: string }>, Q extends z.ZodType> {
  Model: ReturnModelType<any>
  /** Conditions selecting the related documents. */
  filter: (params: z.output<P>, query: z.output<Q>) => Record<string, unknown>
  /** Path parameters schema. Defaults to a single `index`. */
  paramsSchema?: P
  querySchema?: Q
  /** Fields returned in addition to index, name and url. */
  fields?: string[]
  sort?: Record<string, 'asc'>
  /** Respond 404 unless this model has a document with the path `index`. */
  parent?: ReturnModelType<any>
  /** Respond 404 when nothing matches. */
  notFoundWhenEmpty?: boolean
}

/** Handler that lists the resources related to a parent, as a `ResourceList`. */
export function relatedList<
  P extends z.ZodType<{ index: string }> = typeof ShowParamsSchema,
  Q extends z.ZodType = z.ZodType<undefined>
>({
  Model,
  filter,
  paramsSchema,
  querySchema,
  fields = [],
  sort,
  parent,
  notFoundWhenEmpty = false
}: RelatedListOptions<P, Q>) {
  const select = {
    index: 1,
    name: 1,
    url: 1,
    ...Object.fromEntries(fields.map((field) => [field, 1])),
    _id: 0
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = parseRequest(req, res, 'params', (paramsSchema ?? ShowParamsSchema) as P)
      if (params === undefined) return
      const query = querySchema && parseRequest(req, res, 'query', querySchema)
      if (querySchema && query === undefined) return
      const lang = req.lang ?? 'en'

      if (parent !== undefined) {
        const parentDoc = await parent.findOne({ index: params.index }).lean()
        if (parentDoc == null) return res.status(404).json({ error: 'Not found' })
      }

      const found = Model.find(filter(params, query as z.output<Q>)).select(select)
      const data = await (sort ? found.sort(sort) : found)
      if (notFoundWhenEmpty && data.length === 0) {
        return res.status(404).json({ error: 'Not found' })
      }

      const { docs: translated, wasTranslated } = await applyTranslationToList(
        data.map((d: any) => d.toObject()),
        Model.collection.name,
        lang
      )
      res.setHeader('Content-Language', wasTranslated ? lang : 'en')
      return res.status(200).json(ResourceList(translated))
    } catch (err) {
      next(err)
    }
  }
}
