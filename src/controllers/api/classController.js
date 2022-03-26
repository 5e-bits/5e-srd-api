const Class = require('../../models/class');
const Subclass = require('../../models/subclass');
const Level = require('../../models/level');
const Spell = require('../../models/spell');
const Feature = require('../../models/feature');
const Proficiency = require('../../models/proficiency');
const { ResourceList } = require('../../util/data');
const SimpleController = require('../simpleController');

const simpleController = new SimpleController(Class);

exports.index = async (req, res, next) => simpleController.index(req, res, next);
exports.show = async (req, res, next) => simpleController.show(req, res, next);

exports.showLevelsForClass = async (req, res, next) => {
  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Level.find({ 'class.url': urlString }).sort({ level: 'asc' });
    if (data && data.length) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    next(err);
  }
};

exports.showLevelForClass = async (req, res, next) => {
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

exports.showMulticlassingForClass = async (req, res, next) => {
  const urlString = '/api/classes/' + req.params.index;

  try {
    const data = await Class.findOne({ url: urlString });
    return res.status(200).json(data.multi_classing);
  } catch (err) {
    next(err);
  }
};

exports.showSubclassesForClass = async (req, res, next) => {
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

exports.showStartingEquipmentForClass = async (req, res, next) => {
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

exports.showSpellcastingForClass = async (req, res, next) => {
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

exports.showSpellsForClass = async (req, res, next) => {
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

exports.showSpellsForClassAndLevel = async (req, res, next) => {
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

exports.showFeaturesForClass = async (req, res, next) => {
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

exports.showFeaturesForClassAndLevel = async (req, res, next) => {
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

exports.showProficienciesForClass = async (req, res, next) => {
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
