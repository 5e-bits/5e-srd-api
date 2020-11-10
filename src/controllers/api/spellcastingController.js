const Spellcasting = require('../../models/spellcasting');
const utility = require('./utility');

exports.index = async (req, res, next) => {
  const data = await Spellcasting.find()
    .sort({ index: 'asc' })
    .catch(err => {
      next(err);
    });

  res.status(200).json(utility.ClassAPIResource(data));
};

exports.show = async (req, res, next) => {
  const data = await Spellcasting.findOne({ index: req.params.index }).catch(err => {
    next(err);
  });

  if (!data) return next();
  res.status(200).json(data);
};
