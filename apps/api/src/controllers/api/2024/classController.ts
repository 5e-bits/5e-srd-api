import { NextFunction, Request, Response } from 'express'

import { parseRequest } from '@/controllers/parseRequest'
import { relatedList } from '@/controllers/relatedList'
import SimpleController from '@/controllers/simpleController'
import ClassModel from '@/models/2024/class'
import Feature2024Model from '@/models/2024/feature'
import Level2024Model from '@/models/2024/level'
import Spell2024Model from '@/models/2024/spell'
import {
  ClassLevelsQuerySchema,
  LevelParamsSchema,
  ShowParamsSchema,
  SpellIndexQuerySchema
} from '@/schemas/schemas'
import { escapeRegExp, ResourceList } from '@/util'
import { applyTranslation, applyTranslationToList } from '@/util/translation'

const simpleController = new SimpleController(ClassModel)

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)
export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showLevelsForClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = parseRequest(req, res, 'params', ShowParamsSchema)
    if (validatedParams === undefined) return
    const validatedQuery = parseRequest(req, res, 'query', ClassLevelsQuerySchema)
    if (validatedQuery === undefined) return

    const { index } = validatedParams
    const { subclass } = validatedQuery
    const lang = req.lang ?? 'en'
    const classUrl = '/api/2024/classes/' + index

    const searchQueries: Record<string, unknown> = {
      'class.url': classUrl,
      $or: [{ subclass: null }]
    }

    if (subclass !== undefined) {
      ;(searchQueries.$or as unknown[]).push({
        'subclass.url': { $regex: new RegExp(escapeRegExp(subclass), 'i') }
      })
    }

    const data = await Level2024Model.find(searchQueries).sort({ level: 'asc' })
    if (data.length === 0) {
      return res.status(404).json({ error: 'Not found' })
    }

    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2024-levels',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(translated)
  } catch (err) {
    next(err)
  }
}

export const showLevelForClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = parseRequest(req, res, 'params', LevelParamsSchema)
    if (validatedParams === undefined) return
    const { index, level } = validatedParams
    const lang = req.lang ?? 'en'
    const classUrl = '/api/2024/classes/' + index

    const data = await Level2024Model.findOne({ 'class.url': classUrl, level, subclass: null })
    if (!data) return next()

    const plain = data.toObject()
    const translated = await applyTranslation(plain as any, '2024-levels', lang)
    res.setHeader('Content-Language', translated !== plain ? lang : 'en')
    return res.status(200).json(translated)
  } catch (err) {
    next(err)
  }
}

export const showSpellsForClass = relatedList({
  Model: Spell2024Model,
  querySchema: SpellIndexQuerySchema,
  filter: ({ index }, { level }) => ({
    'classes.url': '/api/2024/classes/' + index,
    ...(level !== undefined && { level: { $in: level } })
  }),
  fields: ['level'],
  sort: { level: 'asc', url: 'asc' },
  parent: ClassModel
})

export const showSpellsForClassAndLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedParams = parseRequest(req, res, 'params', LevelParamsSchema)
    if (validatedParams === undefined) return
    const { index, level: classLevel } = validatedParams

    const levelData = await Level2024Model.findOne({
      'class.index': index,
      level: classLevel,
      subclass: null
    }).lean()

    let maxSpellLevel = -1 // -1 indicates no spellcasting ability found

    if (levelData?.spellcasting) {
      maxSpellLevel = 0 // Has spellcasting, so at least cantrips (level 0) might be available
      const spellcasting = levelData.spellcasting
      for (let i = 9; i >= 1; i--) {
        const spellSlotKey = `spell_slots_level_${i}` as keyof typeof spellcasting
        if (spellcasting[spellSlotKey] != null && spellcasting[spellSlotKey]! > 0) {
          maxSpellLevel = i
          break
        }
      }
    }

    if (maxSpellLevel < 0) {
      return res.status(200).json(ResourceList([]))
    }

    const classUrl = '/api/2024/classes/' + index

    const spellData = await Spell2024Model.find({
      'classes.url': classUrl,
      level: { $lte: maxSpellLevel, $gte: 0 }
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' })
      .lean()

    const lang = req.lang ?? 'en'
    const { docs: translated, wasTranslated } = await applyTranslationToList(
      spellData.map((d: any) => ({ ...d })),
      '2024-spells',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}

export const showFeaturesForClassAndLevel = relatedList({
  Model: Feature2024Model,
  paramsSchema: LevelParamsSchema,
  filter: ({ index, level }) => ({
    'class.url': '/api/2024/classes/' + index,
    'level.url': { $regex: new RegExp('/levels/' + level + '$') }
  }),
  sort: { url: 'asc' }
})
