import { ReturnModelType } from '@typegoose/typegoose'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

import { parseRequest } from '@/controllers/parseRequest'
import { NameQuerySchema, ShowParamsSchema } from '@/schemas/schemas'
import { ResourceList } from '@/util/data'
import redisClient from '@/util/RedisClient'
import { escapeRegExp } from '@/util/regex'
import { applyTranslation, applyTranslationToList } from '@/util/translation'

/** Case-insensitive substring match condition. */
export const containsText = (value: string) => ({ $regex: new RegExp(escapeRegExp(value), 'i') })

interface SimpleControllerOptions<Q extends z.ZodType> {
  /** Query parameters accepted by the list endpoint. Defaults to `name` only. */
  querySchema?: Q
  /** Extra conditions for the list query. `name` is always applied. */
  filter?: (query: z.output<Q>) => Record<string, unknown>
  /** Fields returned by the list endpoint in addition to index, name and url. */
  listFields?: string[]
  /** Cache English list responses in Redis, keyed by request URL. */
  cache?: boolean
}

class SimpleController<Q extends z.ZodType = typeof NameQuerySchema> {
  Schema: ReturnModelType<any>
  private querySchema: z.ZodType
  private filter?: (query: z.output<Q>) => Record<string, unknown>
  private listSelect: Record<string, 0 | 1>
  private cache: boolean

  constructor(
    Schema: ReturnModelType<any>,
    { querySchema, filter, listFields = [], cache = false }: SimpleControllerOptions<Q> = {}
  ) {
    this.Schema = Schema
    this.querySchema = querySchema ?? NameQuerySchema
    this.filter = filter
    this.listSelect = {
      index: 1,
      name: 1,
      url: 1,
      ...Object.fromEntries(listFields.map((field) => [field, 1])),
      _id: 0
    }
    this.cache = cache
  }

  private get collectionName(): string {
    return this.Schema.collection.name
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = parseRequest(req, res, 'query', this.querySchema)
      if (validatedQuery === undefined) return

      const query = validatedQuery as z.output<Q> & { name?: string }
      const { name } = query
      const lang = req.lang ?? 'en'

      const searchQueries = {
        ...(name !== undefined && { name: containsText(name) }),
        ...this.filter?.(query)
      }

      // The key is the URL, which does not include an Accept-Language header, so only cache English.
      const useCache = this.cache && lang === 'en'
      if (useCache) {
        const cached = await redisClient.get(req.originalUrl)
        if (cached != null && cached !== '') return res.status(200).json(JSON.parse(cached))
      }

      const data = await this.Schema.find(searchQueries)
        .select(this.listSelect)
        .sort({ index: 'asc' })
        .exec()

      const { docs: translated, wasTranslated } = await applyTranslationToList(
        data.map((d: any) => d.toObject?.() ?? d),
        this.collectionName,
        lang
      )

      const body = ResourceList(translated)
      if (useCache) redisClient.set(req.originalUrl, JSON.stringify(body))
      res.setHeader('Content-Language', wasTranslated ? lang : 'en')
      return res.status(200).json(body)
    } catch (err) {
      next(err)
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedParams = parseRequest(req, res, 'params', ShowParamsSchema)
      if (validatedParams === undefined) return

      const { index } = validatedParams
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
