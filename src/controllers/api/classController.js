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
  await Level.find({ 'class.url': urlString })
    .sort({ level: 'asc' })
    .then(data => {
      if (data && data.length) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(err => {
      next(err);
    });
};

exports.showLevelForClass = async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  let urlString = '/api/classes/' + req.params.index + '/levels/' + req.params.level;

  await Level.findOne({ url: urlString })
    .then(data => {
      if (!data) return next();
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};

exports.showSubclassesForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;
  await Subclass.find({ 'class.url': urlString })
    .sort({ url: 'asc', level: 'asc' })
    .then(data => {
      if (data && data.length) {
        res.status(200).json(utility.NamedAPIResource(data));
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(err => {
      next(err);
    });
};

exports.showStartingEquipmentForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;

  await StartingEquipment.findOne({ 'class.url': urlString })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};

exports.showSpellcastingForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;

  await Spellcasting.findOne({ 'class.url': urlString })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};

exports.showSpellsForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;
  await Spell.find({ 'classes.url': urlString })
    .sort({ level: 'asc', url: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showSpellsForClassAndLevel = async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  let urlString = '/api/classes/' + req.params.index;

  await Spell.find({
    'classes.url': urlString,
    level: parseInt(req.params.level)
  })
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showFeaturesForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;

  Feature.find({
    'class.url': urlString
  })
    .sort({ level: 'asc', url: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showFeaturesForClassAndLevel = async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  let urlString = '/api/classes/' + req.params.index;

  Feature.find({
    'class.url': urlString,
    level: parseInt(req.params.level)
  })
    .sort({ level: 'asc', url: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showProficienciesForClass = async (req, res, next) => {
  let urlString = '/api/classes/' + req.params.index;
  Proficiency.find({ 'classes.url': urlString })
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};
