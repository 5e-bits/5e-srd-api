const StartingEquipment = require('../../models/startingEquipment');
const { ClassAPIResource } = require('../../util/data');

exports.index = (req, res, next) => {
  return StartingEquipment.find()
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(ClassAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.show = (req, res, next) => {
  return StartingEquipment.findOne({ index: req.params.index })
    .then(data => {
      if (!data) return next();
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};
