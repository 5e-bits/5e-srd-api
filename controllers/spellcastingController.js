const Spellcasting = require('../models/spellcasting');
const utility = require('./utility');

exports.index = (req, res, next) => {
  Spellcasting.find((err, _data) => {
    if (err) {
      next(err);
    }
  })
    .sort({ index: 'asc' })
    .exec((err, data) => {
      if (err) {
        next(err);
      }
      res.status(200).json(utility.ClassAPIResource(data));
    });
};

exports.show = (req, res, next) => {
  // search by class
  if (utility.isClassName(req.params.index) === true) {
    Spellcasting.findOne({ 'class.name': utility.upperFirst(req.params.index) }, (err, _data) => {
      if (err) {
        next(err);
      }
    })
      .sort({ url: 'asc', level: 'asc' })
      .exec((err, data) => {
        if (err) {
          next(err);
        }
        res.status(200).json(data);
      });
  } else {
    // return specific document
    Spellcasting.findOne({ index: parseInt(req.params.index) }, (err, data) => {
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
