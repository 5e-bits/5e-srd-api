const Subrace = require('../../models/subrace');
const Trait = require('../../models/trait');
const Proficiency = require('../../models/proficiency');
const { ResourceList } = require('../../util/data');
const SimpleController = require('../simpleController');

const simpleController = new SimpleController(Subrace);

exports.index = (req, res, next) => simpleController.index(req, res, next);
exports.show = (req, res, next) => simpleController.show(req, res, next);

exports.showTraitsForSubrace = (req, res, next) => {
  const urlString = '/api/subraces/' + req.params.index;
  return Trait.find({ 'subraces.url': urlString })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .then(data => {
      res.status(200).json(ResourceList(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.showProficienciesForSubrace = (req, res, next) => {
  const urlString = '/api/subraces/' + req.params.index;

  return Proficiency.find({ 'races.url': urlString })
    .select({ index: 1, name: 1, url: 1, _id: 0 })
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(ResourceList(data));
    })
    .catch(err => {
      next(err);
    });
};
