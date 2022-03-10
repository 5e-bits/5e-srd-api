import Subclass from '../../models/subclass';
import Level from '../../models/level';
import Feature from '../../models/feature';
import { ResourceList } from '../../util/data';
import SimpleController from '../simpleController';
import { Request, Response } from 'express';

const simpleController = new SimpleController(Subclass);

export const index = async (req: any, res: any, next: any) => simpleController.index(req, res, next);
export const show = async (req: any, res: any, next: any) => simpleController.show(req, res, next);

export const showLevelsForSubclass = async (req: any, res: any, next: any) => {
  const urlString = '/api/subclasses/' + req.params.index;

  try {
    const data = await Level.find({ 'subclass.url': urlString }).sort({ level: 'asc' });
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const showLevelForSubclass = async (req: any, res: any, next: any) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/subclasses/' + req.params.index + '/levels/' + req.params.level;

  try {
    const data = await Level.findOne({ url: urlString });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const showFeaturesForSubclass = async (req: any, res: any, next: any) => {
  const urlString = '/api/subclasses/' + req.params.index;

  try {
    const data = await Feature.find({
      'subclass.url': urlString,
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};

export const showFeaturesForSubclassAndLevel = async (req: any, res: any, next: any) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/subclasses/' + req.params.index;

  try {
    const data = await Feature.find({
      level: parseInt(req.params.level),
      'subclass.url': urlString,
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};
