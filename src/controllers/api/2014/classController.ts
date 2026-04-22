import { NextFunction, Request, Response } from 'express'

import SimpleController from '@/controllers/simpleController'
import Class from '@/models/2014/class'
import Feature from '@/models/2014/feature'
import Level from '@/models/2014/level'
import Proficiency from '@/models/2014/proficiency'
import Spell from '@/models/2014/spell'
import Subclass from '@/models/2014/subclass'
import {
  ClassLevelsQuerySchema,
  LevelParamsSchema,
  ShowParamsSchema,
  SpellIndexQuerySchema
} from '@/schemas/schemas'
import { escapeRegExp, ResourceList } from '@/util'
import { applyTranslation, applyTranslationToList } from '@/util/translation'

const simpleController = new SimpleController(Class)
interface ShowLevelsForClassQuery {
  'class.url': string
  $or: Record<string, null | Record<string, RegExp>>[]
}

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next)
export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next)

export const showLevelsForClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate path and query parameters
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    const validatedQuery = ClassLevelsQuerySchema.safeParse(req.query)

    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    if (!validatedQuery.success) {
      return res
        .status(400)
        .json({ error: 'Invalid query parameters', details: validatedQuery.error.issues })
    }

    const { index } = validatedParams.data
    const { subclass } = validatedQuery.data
    const lang = req.lang ?? 'en'

    const searchQueries: ShowLevelsForClassQuery = {
      'class.url': '/api/2014/classes/' + index,
      $or: [{ subclass: null }]
    }

    if (subclass !== undefined) {
      searchQueries.$or.push({
        'subclass.url': { $regex: new RegExp(escapeRegExp(subclass), 'i') }
      })
    }

    const data = await Level.find(searchQueries).sort({ level: 'asc' })
    if (data === null || data === undefined || data.length === 0) {
      return res.status(404).json({ error: 'Not found' })
    }

    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2014-levels',
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
    // Validate path parameters
    const validatedParams = LevelParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index, level } = validatedParams.data
    const lang = req.lang ?? 'en'

    const urlString = '/api/2014/classes/' + index + '/levels/' + level

    const data = await Level.findOne({ url: urlString })
    if (!data) return next()

    const plain = data.toObject()
    const translated = await applyTranslation(plain as any, '2014-levels', lang)
    res.setHeader('Content-Language', translated !== plain ? lang : 'en')
    return res.status(200).json(translated)
  } catch (err) {
    next(err)
  }
}

export const showMulticlassingForClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lang = req.lang ?? 'en'
    const urlString = '/api/2014/classes/' + req.params.index

    const data = await Class.findOne({ url: urlString })
    const plain = data?.toObject() as any
    const translated = await applyTranslation(plain, '2014-classes', lang)
    res.setHeader('Content-Language', translated !== plain ? lang : 'en')
    return res.status(200).json((translated as any)?.multi_classing)
  } catch (err) {
    next(err)
  }
}

export const showSubclassesForClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate path parameters
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data
    const lang = req.lang ?? 'en'

    const urlString = '/api/2014/classes/' + index

    const data = await Subclass.find({ 'class.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ url: 'asc', level: 'asc' })
    if (data === null || data === undefined || data.length === 0) {
      return res.status(404).json({ error: 'Not found' })
    }

    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2014-subclasses',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}

export const showStartingEquipmentForClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lang = req.lang ?? 'en'
    const data = await Class.findOne({ index: req.params.index })
    const plain = data?.toObject() as any
    const translated = await applyTranslation(plain, '2014-classes', lang)
    res.setHeader('Content-Language', translated !== plain ? lang : 'en')
    return res.status(200).json({
      starting_equipment: (translated as any)?.starting_equipment,
      starting_equipment_options: (translated as any)?.starting_equipment_options
    })
  } catch (err) {
    next(err)
  }
}

export const showSpellcastingForClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate path parameters
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data
    const lang = req.lang ?? 'en'

    const data = await Class.findOne({ index })
    const plain = data?.toObject() as any
    if (plain?.spellcasting == null) {
      return res.status(404).json({ error: 'Not found' })
    }

    const translated = await applyTranslation(plain, '2014-classes', lang)
    res.setHeader('Content-Language', translated !== plain ? lang : 'en')
    return res.status(200).json((translated as any)?.spellcasting)
  } catch (err) {
    next(err)
  }
}

export const showSpellsForClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    const validatedQuery = SpellIndexQuerySchema.safeParse(req.query)

    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }

    if (!validatedQuery.success) {
      return res
        .status(400)
        .json({ error: 'Invalid query parameters', details: validatedQuery.error.issues })
    }

    const { index } = validatedParams.data
    const { level } = validatedQuery.data
    const lang = req.lang ?? 'en'

    // Check if class exists first
    const classExists = await Class.findOne({ index }).lean()
    if (!classExists) {
      return res.status(404).json({ error: 'Not found' })
    }

    const urlString = '/api/2014/classes/' + index
    const findQuery: { 'classes.url': string; level?: { $in: number[] } } = {
      'classes.url': urlString
    }

    if (level !== undefined) {
      findQuery.level = { $in: level.map(Number) }
    }

    const data = await Spell.find(findQuery)
      .select({ index: 1, level: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' })
    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2014-spells',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}

export const showSpellsForClassAndLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate path parameters
    const validatedParams = LevelParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index, level: classLevel } = validatedParams.data

    // Find the level data for the class
    const levelData = await Level.findOne({ 'class.index': index, level: classLevel }).lean()

    let maxSpellLevel = -1 // Default to -1 indicating no spellcasting ability found

    if (levelData?.spellcasting) {
      maxSpellLevel = 0 // Has spellcasting, so at least cantrips (level 0) might be available
      const spellcasting = levelData.spellcasting
      for (let i = 9; i >= 1; i--) {
        // Check if the spell slot exists and is greater than 0
        const spellSlotKey = `spell_slots_level_${i}` as keyof typeof spellcasting
        if (spellcasting[spellSlotKey] != null && spellcasting[spellSlotKey]! > 0) {
          maxSpellLevel = i
          break // Found the highest level
        }
      }
    }

    if (maxSpellLevel < 0) {
      return res.status(200).json(ResourceList([]))
    }

    const urlString = '/api/2014/classes/' + index

    // Find spells for the class with level <= maxSpellLevel
    const spellData = await Spell.find({
      'classes.url': urlString,
      level: { $lte: maxSpellLevel, $gte: 0 } // Query uses maxSpellLevel
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' })
      .lean() // Use lean for performance as we only read data

    const lang = req.lang ?? 'en'
    const { docs: translated, wasTranslated } = await applyTranslationToList(
      spellData.map((d: any) => ({ ...d })),
      '2014-spells',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}

export const showFeaturesForClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate path parameters
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data
    const lang = req.lang ?? 'en'

    // Check if class exists first
    const classExists = await Class.findOne({ index }).lean()
    if (!classExists) {
      return res.status(404).json({ error: 'Not found' })
    }

    const urlString = '/api/2014/classes/' + index

    const data = await Feature.find({ 'class.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' })
    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2014-features',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}

export const showFeaturesForClassAndLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate path parameters
    const validatedParams = LevelParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index, level } = validatedParams.data
    const lang = req.lang ?? 'en'

    const urlString = '/api/2014/classes/' + index

    const data = await Feature.find({ 'class.url': urlString, level })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' })
    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2014-features',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}

export const showProficienciesForClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate path parameters
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data
    const lang = req.lang ?? 'en'

    // Check if class exists first
    const classExists = await Class.findOne({ index }).lean()
    if (!classExists) {
      return res.status(404).json({ error: 'Not found' })
    }

    const urlString = '/api/2014/classes/' + index

    const data = await Proficiency.find({ 'classes.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' })
    const { docs: translated, wasTranslated } = await applyTranslationToList(
      data.map((d: any) => d.toObject()),
      '2014-proficiencies',
      lang
    )
    res.setHeader('Content-Language', wasTranslated ? lang : 'en')
    return res.status(200).json(ResourceList(translated))
  } catch (err) {
    next(err)
  }
}
