const Background = require('../../models/background');
const StartingEquipment = require('../../models/startingEquipment');
const SuggestedCharacteristics = require('../../models/suggestedCharacteristics');
const Feature = require('../../models/feature');
const SimpleController = require('../simpleController');

const simpleController = new SimpleController(Background);

exports.index = (req, res, next) => simpleController.index(req, res, next);
exports.show = (req, res, next) => simpleController.show(req, res, next);

exports.showStartingEquipmentForBackground = (req, res, next) => {
  const urlString = '/api/backgrounds/' + req.params.index;

  return StartingEquipment.findOne({ 'background.url': urlString })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};

exports.showSuggestedCharacteristicsForBackground = (req, res, next) => {
  const urlString = '/api/backgrounds/' + req.params.index;

  return SuggestedCharacteristics.findOne({ 'background.url': urlString })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};

exports.showFeatureForBackground = (req, res, next) => {
  const urlString = '/api/backgrounds/' + req.params.index;

  return Feature.findOne({ 'background.url': urlString })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};
