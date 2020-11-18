const Race = require('../../models/race');
const Subrace = require('../../models/subrace');
const Trait = require('../../models/trait');
const Proficiency = require('../../models/proficiency');

const utility = require('./utility');
const SimpleController = require('../simpleController');

const simpleController = new SimpleController(Race);

exports.index = (req, res, next) => simpleController.index(req, res, next);
exports.show = (req, res, next) => simpleController.show(req, res, next);

exports.showSubracesForRace = (req, res, next) => {
  const urlString = '/api/races/' + req.params.index;
  return Subrace.find({ 'race.url': urlString })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .then(data => {
      res.status(200).json(utility.ResourceList(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showTraitsForRace = (req, res, next) => {
  const urlString = '/api/races/' + req.params.index;
  return Trait.find({ 'races.url': urlString })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .then(data => {
      res.status(200).json(utility.ResourceList(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showProficienciesForRace = (req, res, next) => {
  const urlString = '/api/races/' + req.params.index;

  return Proficiency.find({ 'races.url': urlString })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.ResourceList(data));
    })
    .catch(err => {
      next(err);
    });
};
