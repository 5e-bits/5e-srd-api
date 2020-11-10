const StartingEquipment = require('../../models/startingEquipment');
const utility = require('./utility');

exports.index = async (req, res, next) => {
  const data = await StartingEquipment.find()
    .sort({ index: 'asc' })
    .catch(err => {
      next(err);
    });

  res.status(200).json(utility.ClassAPIResource(data));
};

exports.show = async (req, res, next) => {
  const data = await StartingEquipment.findOne({ index: req.params.index }).catch(err => {
    next(err);
  });

  if (!data) return next();
  res.status(200).json(data);
};
