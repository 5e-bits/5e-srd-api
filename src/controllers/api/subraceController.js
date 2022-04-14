const Subrace = require('../../models/subrace');
const Trait = require('../../models/trait');
const Proficiency = require('../../models/proficiency');
const { ResourceList } = require('../../util/data');
const SimpleController = require('../simpleController');

const simpleController = new SimpleController(Subrace);

exports.index = async (req, res, next) => simpleController.index(req, res, next);
exports.show = async (req, res, next) => simpleController.show(req, res, next);

exports.showTraitsForSubrace = async (req, res, next) => {
  const urlString = '/api/subraces/' + req.params.index;
  try {
    const data = await Trait.find({ 'subraces.url': urlString }).select({
      index: 1,
      name: 1,
      url: 1,
      _id: 0,
    });

    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};

exports.showProficienciesForSubrace = async (req, res, next) => {
  const urlString = '/api/subraces/' + req.params.index;

  try {
    const data = await Proficiency.find({ 'races.url': urlString })
      .select({ index: 1, name: 1, url: 1, _id: 0 })
      .sort({ index: 'asc' });
    return res.status(200).json(ResourceList(data));
  } catch (err) {
    next(err);
  }
};
