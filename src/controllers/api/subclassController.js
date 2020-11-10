const Subclass = require('../../models/subclass');
const Level = require('../../models/level');
const Feature = require('../../models/feature');
const utility = require('./utility');
const SimpleController = require('../simpleController');

const simpleController = new SimpleController(Subclass);

exports.index = async (req, res, next) => await simpleController.index(req, res, next);
exports.show = async (req, res, next) => await simpleController.show(req, res, next);

exports.showLevelsForSubclass = async (req, res, next) => {
  const urlString = '/api/subclasses/' + req.params.index;

  const data = await Level.find({ 'subclass.url': urlString })
    .sort({ level: 'asc' })
    .catch(err => {
      next(err);
    });

  res.status(200).json(data);
};

exports.showLevelForSubclass = async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  let urlString = '/api/subclasses/' + req.params.index + '/levels/' + req.params.level;

  const data = await Level.findOne({ url: urlString }).catch(err => {
    next(err);
  });

  if (!data) return next();
  res.status(200).json(data);
};

exports.showFeaturesForSubclass = async (req, res, next) => {
  const urlString = '/api/subclasses/' + req.params.index;
  const data = await Feature.find({
    'subclass.url': urlString
  })
    .sort({ level: 'asc', url: 'asc' })
    .catch(err => {
      next(err);
    });

  res.status(200).json(utility.NamedAPIResource(data));
};

exports.showFeaturesForSubclassAndLevel = async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/subclasses/' + req.params.index;

  const data = await Feature.find({
    level: parseInt(req.params.level),
    'subclass.url': urlString
  })
    .sort({ level: 'asc', url: 'asc' })
    .catch(err => {
      next(err);
    });

  res.status(200).json(utility.NamedAPIResource(data));
};
