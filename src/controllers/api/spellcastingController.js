const Spellcasting = require('../../models/spellcasting');
const utility = require('./utility');

exports.index = async (req, res, next) => {
  await Spellcasting.find()
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.ClassAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.show = async (req, res, next) => {
  await Spellcasting.findOne({ index: req.params.index })
    .then(data => {
      if (!data) return next();
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};
