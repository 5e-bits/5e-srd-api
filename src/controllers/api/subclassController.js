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

  await Level.find({ 'subclass.url': urlString })
    .sort({ level: 'asc' })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};

exports.showLevelForSubclass = async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  let urlString = '/api/subclasses/' + req.params.index + '/levels/' + req.params.level;

  await Level.findOne({ url: urlString })
    .then(data => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(err => {
      next(err);
    });
};

exports.showFeaturesForSubclass = async (req, res, next) => {
  const urlString = '/api/subclasses/' + req.params.index;
  Feature.find({
    'subclass.url': urlString
  })
    .sort({ level: 'asc', url: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showFeaturesForSubclassAndLevel = async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/subclasses/' + req.params.index;

  Feature.find({
    level: parseInt(req.params.level),
    'subclass.url': urlString
  })
    .sort({ level: 'asc', url: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};
