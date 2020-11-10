const Spellcasting = require('../../models/spellcasting');
const utility = require('./utility');

exports.index = (req, res, next) => {
  return Spellcasting.find()
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.ClassAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.show = (req, res, next) => {
  return Spellcasting.findOne({ index: req.params.index })
    .then(data => {
      if (!data) return next();
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};
