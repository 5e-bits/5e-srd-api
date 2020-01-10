const AbilityScore = require('../../models/abilityScore');
const utility = require('./utility');

exports.index = (req, res, next) => {
  const search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = req.query.name;
  }

  AbilityScore.find(search_queries)
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.show = async (req, res, next) => {
  await AbilityScore.findOne({ index: req.params.index })
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
