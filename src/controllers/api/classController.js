const Class = require('../../models/class');
const Subclass = require('../../models/subclass');
const Level = require('../../models/level');
const Spell = require('../../models/spell');
const Feature = require('../../models/feature');
const Proficiency = require('../../models/proficiency');
const { ResourceList } = require('../../util/data');
const SimpleController = require('../simpleController');

const simpleController = new SimpleController(Class);

exports.index = (req, res, next) => simpleController.index(req, res, next);
exports.show = (req, res, next) => simpleController.show(req, res, next);

exports.showLevelsForClass = (req, res, next) => {
  const urlString = '/api/classes/' + req.params.index;
  return Level.find({ 'class.url': urlString })
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

exports.showLevelForClass = (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/classes/' + req.params.index + '/levels/' + req.params.level;

  return Level.findOne({ url: urlString })
    .then(data => {
      if (!data) return next();
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};

exports.showSubclassesForClass = (req, res, next) => {
  const urlString = '/api/classes/' + req.params.index;
  return Subclass.find({ 'class.url': urlString })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .sort({ url: 'asc', level: 'asc' })
    .then(data => {
      if (data && data.length) {
        res.status(200).json(ResourceList(data));
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(err => {
      next(err);
    });
};

exports.showStartingEquipmentForClass = (req, res, next) => {
  return Class.findOne({ index: req.params.index })
    .then(data => {
      res.status(200).json({
        starting_equipment: data.starting_equipment,
        starting_equipment_options: data.starting_equipment_options,
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.showSpellcastingForClass = (req, res, next) => {
  return Class.findOne({ index: req.params.index })
    .then(data => {
      res.status(200).json(data.spellcasting);
    })
    .catch(err => {
      next(err);
    });
};

exports.showSpellsForClass = (req, res, next) => {
  const urlString = '/api/classes/' + req.params.index;
  return Spell.find({ 'classes.url': urlString })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .sort({ level: 'asc', url: 'asc' })
    .then(data => {
      res.status(200).json(ResourceList(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showSpellsForClassAndLevel = (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/classes/' + req.params.index;

  return Spell.find({
    'classes.url': urlString,
    level: parseInt(req.params.level),
  })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(ResourceList(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showFeaturesForClass = (req, res, next) => {
  const urlString = '/api/classes/' + req.params.index;

  return Feature.find({
    'class.url': urlString,
  })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .sort({ level: 'asc', url: 'asc' })
    .then(data => {
      res.status(200).json(ResourceList(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showFeaturesForClassAndLevel = (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.level))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const urlString = '/api/classes/' + req.params.index;

  return Feature.find({
    'class.url': urlString,
    level: parseInt(req.params.level),
  })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .sort({ level: 'asc', url: 'asc' })
    .then(data => {
      res.status(200).json(ResourceList(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showProficienciesForClass = (req, res, next) => {
  const urlString = '/api/classes/' + req.params.index;
  return Proficiency.find({ 'classes.url': urlString })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(ResourceList(data));
    })
    .catch(err => {
      next(err);
    });
};
