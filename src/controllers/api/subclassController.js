const Subclass = require('../../models/subclass');
const Level = require('../../models/level');
const Feature = require('../../models/feature');
const { ResourceList } = require('../../util/data');
const SimpleController = require('../simpleController');

const simpleController = new SimpleController(Subclass);

exports.index = async (req, res, next) => simpleController.index(req, res, next);
exports.show = async (req, res, next) => simpleController.show(req, res, next);

exports.showLevelsForSubclass = async (req, res, next) => {
  const urlString = '/api/subclasses/' + req.params.index;

  try {
    const data = await Level.find({ 'subclass.url': urlString }).sort({ level: 'asc' });
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.showLevelForSubclass = async (req, res, next) => {
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

exports.showFeaturesForSubclass = async (req, res, next) => {
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

exports.showFeaturesForSubclassAndLevel = async (req, res, next) => {
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
