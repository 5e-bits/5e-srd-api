const StartingEquipment = require('../../models/startingEquipment');
const utility = require('./utility');

exports.index = async (req, res, next) => {
  await StartingEquipment.find()
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.ClassAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.show = (req, res, next) => {
  // TODO: Move this out of here
  if (utility.isClassName(req.params.index) === true) {
    StartingEquipment.findOne(
      { 'class.name': utility.class_map[req.params.index] },
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
        res.status(200).json(data);
      });
  } else {
    // return specific document
    StartingEquipment.findOne({ index: parseInt(req.params.index) }, (err, data) => {
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
