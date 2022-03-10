import Class from '../../models/class';
import Subclass from '../../models/subclass';
import Level from '../../models/level';
import Spell from '../../models/spell';
import Feature from '../../models/feature';
import Proficiency from '../../models/proficiency';
import { ResourceList } from '../../util/data';
import SimpleController from '../simpleController';

const simpleController = new SimpleController(Class);
import { Request, Response } from 'express';

export const index = async (req: any, res: any, next: any) => simpleController.index(req, res, next);
export const show = async (req: any, res: any, next: any) => simpleController.show(req, res, next);

export const showLevelsForClass = async (req: any, res: any, next: any) => {
  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Level.find({ 'class.url': urlString }).sort({ level: 'asc' });
    if (data && data.length) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    next(err);
  }
};

export const showLevelForClass = async (req: any, res: any, next: any) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/classes/' + req.params.index + '/levels/' + req.params.level;

  try {
    const data = await Level.findOne({ url: urlString });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const showMulticlassingForClass = async (req: any, res: any, next: any) => {
  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Class.findOne({ url: urlString });
    return res.status(200).json(data?.multi_classing);
  } catch (err) {
    next(err);
  }
};

export const showSubclassesForClass = async (req: any, res: any, next: any) => {
  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Subclass.find({ 'class.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ url: 'asc', level: 'asc' });
    if (data && data.length) {
      return res.status(200).json(ResourceList(data));
    } else {
      return res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    next(err);
  }
};

export const showStartingEquipmentForClass = async (req: any, res: any, next: any) => {
  try {
    const data = await Class.findOne({ index: req.params.index });
    return res.status(200).json({
      starting_equipment: data?.starting_equipment,
      starting_equipment_options: data?.starting_equipment_options,
    });
  } catch (err) {
    next(err);
  }
};

export const showSpellcastingForClass = async (req: any, res: any, next: any) => {
  try {
    const data = await Class.findOne({ index: req.params.index });
    return res.status(200).json(data?.spellcasting);
  } catch (err) {
    next(err);
  }
};

export const showSpellsForClass = async (req: any, res: any, next: any) => {
  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Spell.find({ 'classes.url': urlString })
      .select({ index: 1, name: 1, url: 1 })
      .sort({ level: 'asc', url: 'asc' });

    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};

export const showSpellsForClassAndLevel = async (req: any, res: any, next: any) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Spell.find({
      'classes.url': urlString,
      level: parseInt(req.params.level),
    })
      .select({ index: 1, name: 1, url: 1 })
      .sort({ index: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};

export const showFeaturesForClass = async (req: any, res: any, next: any) => {
  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Feature.find({
      'class.url': urlString,
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};

export const showFeaturesForClassAndLevel = async (req: any, res: any, next: any) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Feature.find({
      'class.url': urlString,
      level: parseInt(req.params.level),
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};

export const showProficienciesForClass = async (req: any, res: any, next: any) => {
  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Proficiency.find({ 'classes.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};
