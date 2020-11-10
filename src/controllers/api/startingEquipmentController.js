const StartingEquipment = require('../../models/startingEquipment');
const utility = require('./utility');

exports.index = async (req, res, next) => {
  try {
    const data = await StartingEquipment.find().sort({ index: 'asc' });
    res.status(200).json(utility.ClassAPIResource(data));
  } catch (err) {
    next(err);
  }
};

exports.show = async (req, res, next) => {
  try {
    const data = await StartingEquipment.findOne({ index: req.params.index });
    if (!data) return next();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
