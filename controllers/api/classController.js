const Class = require('../../models/class');
const Level = require('../../models/level');
const utility = require('./utility');

exports.index = (req, res, next) => {
  Class.find((err, _data) => {
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
  // search by race
  if (utility.isClassName(req.params.index) === true) {
    Class.findOne({ name: utility.upperFirst(req.params.index) }, (err, _data) => {
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
    res.status(404).json({ error: 'Not found' });
  }
};

exports.showLevelsForClass = (req, res, next) => {
  Level.find({ 'class.name': utility.class_map[req.params.index], subclass: {} }, (err, _data) => {
    if (err) {
      next(err);
    }
  })
    .sort({ level: 'asc' })
    .exec((err, data) => {
      if (err) {
        next(err);
      }
      res.status(200).json(data);
    });
};

exports.showLevelForClass = (req, res, next) => {
  if (typeof parseInt(req.params.level) == 'number') {
    let urlString = '/api/classes/' + req.params.index + '/level/' + req.params.level;

    Level.findOne({ url: urlString }, (err, data) => {
      if (err) {
        next(err);
      }
      res.status(200).json(data);
    });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
