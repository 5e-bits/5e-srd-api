const Subclass = require('../../models/subclass');
const Level = require('../../models/level');
const Feature = require('../../models/feature');
const utility = require('./utility');

exports.index = async (req, res, next) => {
  const search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = { $regex: new RegExp(utility.escapeRegExp(req.query.name), 'i') };
  }

  await Subclass.find(search_queries)
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.show = async (req, res, next) => {
  await Subclass.findOne({ index: req.params.index })
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
