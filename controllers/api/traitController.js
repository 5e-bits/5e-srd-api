const Trait = require('../../models/trait');
const utility = require('./utility');

exports.index = async (req, res, next) => {
  const search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = req.query.name;
  }

  await Trait.find(search_queries)
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.show = (req, res, next) => {
  // TODO: Move this out of here
  if (utility.isRaceName(req.params.index) === true) {
    Trait.find({ 'races.name': utility.race_map[req.params.index] }, (err, _data) => {
      if (err) {
        next(err);
      }
    })
      .sort({ url: 'asc' })
      .exec((err, data) => {
        if (err) {
          next(err);
        }
        res.status(200).json(utility.NamedAPIResource(data));
      });
  } else if (utility.isSubraceName(req.params.index) === true) {
    Trait.find({ 'races.name': utility.subrace_map[req.params.index] }, (err, _data) => {
      if (err) {
        next(err);
      }
    })
      .sort({ url: 'asc' })
      .exec((err, data) => {
        if (err) {
          next(err);
        }
        res.status(200).json(utility.NamedAPIResource(data));
      });
  } else {
    // return specific document
    Trait.findOne({ index: req.params.index })
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
  }
};
