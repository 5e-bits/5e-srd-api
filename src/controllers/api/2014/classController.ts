import { Request, Response, NextFunction } from 'express'
import { ShowParamsSchema, LevelParamsSchema, ClassLevelsQuerySchema } from '@/schemas/schemas'

import { ResourceList, escapeRegExp } from '@/util'

import Class from '@/models/2014/class'
import Feature from '@/models/2014/feature'
import Level from '@/models/2014/level'
import Proficiency from '@/models/2014/proficiency'
import SimpleController from '@/controllers/simpleController'
import Spell from '@/models/2014/spell'
import Subclass from '@/models/2014/subclass'

const simpleController = new SimpleController(Class)
interface ShowLevelsForClassQuery {
  'class.url': string;
  '$or': Record<string, null | Record<string, RegExp>>[];
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

    const searchQueries: ShowLevelsForClassQuery = {
      'class.url': '/api/2014/classes/' + index,
      '$or': [{ subclass: null }]
    }

    if (subclass !== undefined) {
      searchQueries.$or.push({
        'subclass.url': { $regex: new RegExp(escapeRegExp(subclass), 'i') }
      })
    }

    const data = await Level.find(searchQueries).sort({ level: 'asc' })
    if (data !== null && data !== undefined && data.length > 0) {
      return res.status(200).json(data)
    } else {
      return res.status(404).json({ error: 'Not found' })
    }
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

    const urlString = '/api/2014/classes/' + index + '/levels/' + level

    const data = await Level.findOne({ url: urlString })
    if (!data) return next()
    return res.status(200).json(data)
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
    const urlString = '/api/2014/classes/' + req.params.index

    const data = await Class.findOne({ url: urlString })
    return res.status(200).json(data?.multi_classing)
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

    const urlString = '/api/2014/classes/' + index

    const data = await Subclass.find({ 'class.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ url: 'asc', level: 'asc' })
    if (data !== null && data !== undefined && data.length > 0) {
      return res.status(200).json(ResourceList(data))
    } else {
      return res.status(404).json({ error: 'Not found' })
    }
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
    const data = await Class.findOne({ index: req.params.index })
    return res.status(200).json({
      starting_equipment: data?.starting_equipment,
      starting_equipment_options: data?.starting_equipment_options
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

    const data = await Class.findOne({ index: index })
    if (
      data !== null &&
      data !== undefined &&
      data.spellcasting !== null &&
      data.spellcasting !== undefined
    ) {
      return res.status(200).json(data.spellcasting)
    } else {
      return res.status(404).json({ error: 'Not found' })
    }
  } catch (err) {
    next(err)
  }
}

export const showSpellsForClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate path parameters
    const validatedParams = ShowParamsSchema.safeParse(req.params)
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues })
    }
    const { index } = validatedParams.data

    const urlString = '/api/2014/classes/' + index

    const data = await Spell.find({ 'classes.url': urlString })
      .select({ index: 1, level: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' })
    return res.status(200).json(ResourceList(data))
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
    const { index, level } = validatedParams.data

    const urlString = '/api/2014/classes/' + index

    const data = await Spell.find({
      'classes.url': urlString,
      'level': level
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' })
    return res.status(200).json(ResourceList(data))
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

    const urlString = '/api/2014/classes/' + index

    const data = await Feature.find({
      'class.url': urlString
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' })
    return res.status(200).json(ResourceList(data))
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

    const urlString = '/api/2014/classes/' + index

    const data = await Feature.find({
      'class.url': urlString,
      'level': level
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' })
    return res.status(200).json(ResourceList(data))
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

    const urlString = '/api/2014/classes/' + index

    const data = await Proficiency.find({ 'classes.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' })
    return res.status(200).json(ResourceList(data))
  } catch (err) {
    next(err)
  }
}
