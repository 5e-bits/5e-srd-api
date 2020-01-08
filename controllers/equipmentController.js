const Equipment = require('../models/equipment');
const utility = require('./utility');

exports.index = (req, res, next) => {
  Equipment.find((err, _data) => {
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
  Equipment.findOne({ index: req.params.index }, (err, data) => {
    if (err) {
      next(err);
    }

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });
};
