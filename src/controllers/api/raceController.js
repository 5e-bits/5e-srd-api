const Race = require('../../models/race');
const Subrace = require('../../models/subrace');
const Trait = require('../../models/trait');
const Proficiency = require('../../models/proficiency');

const utility = require('./utility');
const SimpleController = require('../simpleController');

const simpleController = new SimpleController(Race);

exports.index = async (req, res, next) => await simpleController.index(req, res, next);
exports.show = async (req, res, next) => await simpleController.show(req, res, next);

exports.showSubracesForRace = async (req, res, next) => {
  const urlString = '/api/races/' + req.params.index;

  try {
    const data = await Subrace.find({ 'race.url': urlString });
    res.status(200).json(utility.NamedAPIResource(data));
  } catch (err) {
    next(err);
  }
};

exports.showTraitsForRace = async (req, res, next) => {
  const urlString = '/api/races/' + req.params.index;
  try {
    const data = await Trait.find({ 'races.url': urlString });
    res.status(200).json(utility.NamedAPIResource(data));
  } catch (err) {
    next(err);
  }
};

exports.showProficienciesForRace = async (req, res, next) => {
  const urlString = '/api/races/' + req.params.index;

  try {
    const data = await Proficiency.find({ 'races.url': urlString }).sort({ index: 'asc' });
    res.status(200).json(utility.NamedAPIResource(data));
  } catch (err) {
    next(err);
  }
};
