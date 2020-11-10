const Class = require('../../models/class');
const Subclass = require('../../models/subclass');
const Level = require('../../models/level');
const StartingEquipment = require('../../models/startingEquipment');
const Spellcasting = require('../../models/spellcasting');
const Spell = require('../../models/spell');
const Feature = require('../../models/feature');
const Proficiency = require('../../models/proficiency');
const utility = require('./utility');
const SimpleController = require('../simpleController');

const simpleController = new SimpleController(Class);

exports.index = async (req, res, next) => await simpleController.index(req, res, next);
exports.show = async (req, res, next) => await simpleController.show(req, res, next);

exports.showLevelsForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;
  const data = await Level.find({ 'class.url': urlString })
    .sort({ level: 'asc' })
    .catch(err => {
      next(err);
    });
  if (data && data.length) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

exports.showLevelForClass = async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  let urlString = '/api/classes/' + req.params.index + '/levels/' + req.params.level;

  const data = await Level.findOne({ url: urlString }).catch(err => {
    next(err);
  });

  if (!data) return next();
  res.status(200).json(data);
};

exports.showSubclassesForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;
  const data = await Subclass.find({ 'class.url': urlString })
    .sort({ url: 'asc', level: 'asc' })
    .catch(err => {
      next(err);
    });

  if (data && data.length) {
    res.status(200).json(utility.NamedAPIResource(data));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

exports.showStartingEquipmentForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;

  const data = await StartingEquipment.findOne({ 'class.url': urlString }).catch(err => {
    next(err);
  });

  res.status(200).json(data);
};

exports.showSpellcastingForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;

  const data = await Spellcasting.findOne({ 'class.url': urlString }).catch(err => {
    next(err);
  });

  res.status(200).json(data);
};

exports.showSpellsForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;
  const data = await Spell.find({ 'classes.url': urlString })
    .sort({ level: 'asc', url: 'asc' })
    .catch(err => {
      next(err);
    });

  res.status(200).json(utility.NamedAPIResource(data));
};

exports.showSpellsForClassAndLevel = async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  let urlString = '/api/classes/' + req.params.index;

  const data = await Spell.find({
    'classes.url': urlString,
    level: parseInt(req.params.level)
  })
    .sort({ index: 'asc' })
    .catch(err => {
      next(err);
    });

  res.status(200).json(utility.NamedAPIResource(data));
};

exports.showFeaturesForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;

  const data = await Feature.find({
    'class.url': urlString
  })
    .sort({ level: 'asc', url: 'asc' })
    .catch(err => {
      next(err);
    });

  res.status(200).json(utility.NamedAPIResource(data));
};

exports.showFeaturesForClassAndLevel = async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  let urlString = '/api/classes/' + req.params.index;

  const data = await Feature.find({
    'class.url': urlString,
    level: parseInt(req.params.level)
  })
    .sort({ level: 'asc', url: 'asc' })
    .catch(err => {
      next(err);
    });

  res.status(200).json(utility.NamedAPIResource(data));
};

exports.showProficienciesForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;
  const data = await Proficiency.find({ 'classes.url': urlString })
    .sort({ index: 'asc' })
    .catch(err => {
      next(err);
    });
  res.status(200).json(utility.NamedAPIResource(data));
};
