import Feature from '../../models/feature/index.js';
import Level from '../../models/level/index.js';
import { ResourceList } from '../../util/data.js';
import SimpleController from '../simpleController.js';
import Subclass from '../../models/subclass/index.js';

const simpleController = new SimpleController(Subclass);

export const index = async (req, res, next) => simpleController.index(req, res, next);
export const show = async (req, res, next) => simpleController.show(req, res, next);

export const showLevelsForSubclass = async (req, res, next) => {
  try {
    const urlString = '/api/subclasses/' + req.params.index;

    const data = await Level.find({ 'subclass.url': urlString }).sort({ level: 'asc' });
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const showLevelForSubclass = async (req, res, next) => {
  try {
    if (!Number.isInteger(parseInt(req.params.level))) {
      return res.status(404).json({ error: 'Not found' });
    }

    const urlString = '/api/subclasses/' + req.params.index + '/levels/' + req.params.level;

    const data = await Level.findOne({ url: urlString });
    if (!data) return next();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const showFeaturesForSubclass = async (req, res, next) => {
  try {
    const urlString = '/api/subclasses/' + req.params.index;

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

export const showFeaturesForSubclassAndLevel = async (req, res, next) => {
  try {
    if (!Number.isInteger(parseInt(req.params.level))) {
      return res.status(404).json({ error: 'Not found' });
    }

    const urlString = '/api/subclasses/' + req.params.index;

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
