import { Request, Response, NextFunction } from 'express';
import { ShowParamsSchema } from '@/schemas/schemas';

import Proficiency from '@/models/2014/proficiency';
import Race from '@/models/2014/race';
import { ResourceList } from '@/util/data';
import SimpleController from '@/controllers/simpleController';
import Subrace from '@/models/2014/subrace';
import Trait from '@/models/2014/trait';

const simpleController = new SimpleController(Race);

export const index = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.index(req, res, next);
export const show = async (req: Request, res: Response, next: NextFunction) =>
  simpleController.show(req, res, next);

export const showSubracesForRace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate path parameters
    const validatedParams = ShowParamsSchema.safeParse(req.params);
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues });
    }
    const { index } = validatedParams.data;

    const urlString = '/api/2014/races/' + index;

    const data = await Subrace.find({ 'race.url': urlString }).select({
      index: 1,
      name: 1,
      url: 1,
      _id: 0,
    });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};

export const showTraitsForRace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate path parameters
    const validatedParams = ShowParamsSchema.safeParse(req.params);
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues });
    }
    const { index } = validatedParams.data;

    const urlString = '/api/2014/races/' + index;

    const data = await Trait.find({ 'races.url': urlString }).select({
      index: 1,
      name: 1,
      url: 1,
      _id: 0,
    });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};

export const showProficienciesForRace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate path parameters
    const validatedParams = ShowParamsSchema.safeParse(req.params);
    if (!validatedParams.success) {
      return res
        .status(400)
        .json({ error: 'Invalid path parameters', details: validatedParams.error.issues });
    }
    const { index } = validatedParams.data;

    const urlString = '/api/2014/races/' + index;

    const data = await Proficiency.find({ 'races.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};
