import { ResourceList, escapeRegExp } from '../../util/index.js';

import Class from '../../models/class/index.js';
import Feature from '../../models/feature/index.js';
import Level from '../../models/level/index.js';
import Proficiency from '../../models/proficiency/index.js';
import SimpleController from '../simpleController.js';
import Spell from '../../models/spell/index.js';
import Subclass from '../../models/subclass/index.js';

const simpleController = new SimpleController(Class);

export const index = async (req, res, next) => simpleController.index(req, res, next);
export const show = async (req, res, next) => simpleController.show(req, res, next);

export const showLevelsForClass = async (req, res, next) => {
  const searchQueries = {
    'class.url': '/api/classes/' + req.params.index,
    $or: [{ subclass: null }],
  };

  if (req.query.subclass !== undefined) {
    searchQueries.$or.push({
      'subclass.url': { $regex: new RegExp(escapeRegExp(req.query.subclass), 'i') },
    });
  }

  try {
    const data = await Level.find(searchQueries).sort({ level: 'asc' });
    if (data && data.length) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    next(err);
  }
};

export const showLevelForClass = async (req, res, next) => {
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

export const showMulticlassingForClass = async (req, res, next) => {
  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Class.findOne({ url: urlString });
    return res.status(200).json(data.multi_classing);
  } catch (err) {
    next(err);
  }
};

export const showSubclassesForClass = async (req, res, next) => {
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

export const showStartingEquipmentForClass = async (req, res, next) => {
  try {
    const data = await Class.findOne({ index: req.params.index });
    return res.status(200).json({
      starting_equipment: data.starting_equipment,
      starting_equipment_options: data.starting_equipment_options,
    });
  } catch (err) {
    next(err);
  }
};

export const showSpellcastingForClass = async (req, res, next) => {
  try {
    const data = await Class.findOne({ index: req.params.index });
    if (data && data.spellcasting) {
      return res.status(200).json(data.spellcasting);
    } else {
      return res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    next(err);
  }
};

export const showSpellsForClass = async (req, res, next) => {
  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Spell.find({ 'classes.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ level: 'asc', url: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};

export const showSpellsForClassAndLevel = async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Spell.find({
      'classes.url': urlString,
      level: parseInt(req.params.level),
    })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};

export const showFeaturesForClass = async (req, res, next) => {
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

export const showFeaturesForClassAndLevel = async (req, res, next) => {
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

export const showProficienciesForClass = async (req, res, next) => {
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
