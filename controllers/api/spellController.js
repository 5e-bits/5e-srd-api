const Spell = require('../../models/spell');
const utility = require('./utility');

exports.index = (req, res, next) => {
  var search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = req.query.name;
  }

  Spell.find(search_queries, (err, _data) => {
    if (err) {
      next(err);
    }
  })
    .sort({ index: 'asc' })
    .exec((err, data) => {
      if (err) {
        next(err);
      }
      res.status(200).json(utility.NamedAPIResource(data));
    });
};

exports.show = (req, res, next) => {
  // search by class
  if (utility.isClassName(req.params.index) === true) {
    Spell.find({ 'classes.name': utility.class_map[req.params.index] }, (err, _data) => {
      if (err) {
        next(err);
      }
    })
      .sort({ url: 'asc', level: 'asc' })
      .exec((err, data) => {
        if (err) {
          next(err);
        }
        res.status(200).json(utility.NamedAPIResource(data));
      });
  } else {
    // return specific document
    Spell.findOne({ index: req.params.index }, (err, data) => {
      if (err) {
        next(err);
      }

      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    });
  }
};

exports.showSpellsForClassLevel = (req, res, next) => {
  if (typeof parseInt(req.params.level) == 'number') {
    Spell.find(
      {
        'classes.name': utility.class_map[req.params.index],
        level: parseInt(req.params.level)
      },
      (err, _data) => {
        if (err) {
          next(err);
        }
      }
    )
      .sort({ url: 'asc', level: 'asc' })
      .exec((err, data) => {
        if (err) {
          next(err);
        }
        res.status(200).json(utility.NamedAPIResource(data));
      });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
