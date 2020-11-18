const Subclass = require('../../models/subclass');
const Level = require('../../models/level');
const Feature = require('../../models/feature');
const utility = require('./utility');
const SimpleController = require('../simpleController');

const simpleController = new SimpleController(Subclass);

exports.index = (req, res, next) => simpleController.index(req, res, next);
exports.show = (req, res, next) => simpleController.show(req, res, next);

exports.showLevelsForSubclass = (req, res, next) => {
  const urlString = '/api/subclasses/' + req.params.index;

  return Level.find({ 'subclass.url': urlString })
    .sort({ level: 'asc' })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};

exports.showLevelForSubclass = (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/subclasses/' + req.params.index + '/levels/' + req.params.level;

  return Level.findOne({ url: urlString })
    .then(data => {
      if (!data) return next();
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};

exports.showFeaturesForSubclass = (req, res, next) => {
  const urlString = '/api/subclasses/' + req.params.index;
  return Feature.find({
    'subclass.url': urlString
  })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .sort({ level: 'asc', url: 'asc' })
    .then(data => {
      res.status(200).json(utility.ResourceList(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showFeaturesForSubclassAndLevel = (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/subclasses/' + req.params.index;

  return Feature.find({
    level: parseInt(req.params.level),
    'subclass.url': urlString
  })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .sort({ level: 'asc', url: 'asc' })
    .then(data => {
      res.status(200).json(utility.ResourceList(data));
    })
    .catch(err => {
      next(err);
    });
};
