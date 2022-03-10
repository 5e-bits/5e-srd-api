import Race from '../../models/race';
import Subrace from '../../models/subrace';
import Trait from '../../models/trait';
import Proficiency from '../../models/proficiency';
import { ResourceList } from '../../util/data';
import SimpleController from '../simpleController';
import { Request, Response } from 'express';

const simpleController = new SimpleController(Race);

export const index = async (req: any, res: any, next: any) => simpleController.index(req, res, next);
export const show = async (req: any, res: any, next: any) => simpleController.show(req, res, next);

export const showSubracesForRace = async (req: any, res: any, next: any) => {
  const urlString = '/api/races/' + req.params.index;

  try {
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

export const showTraitsForRace = async (req: any, res: any, next: any) => {
  const urlString = '/api/races/' + req.params.index;

  try {
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

export const showProficienciesForRace = async (req: any, res: any, next: any) => {
  const urlString = '/api/races/' + req.params.index;

  try {
    const data = await Proficiency.find({ 'races.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};
