const Subclass = require('../../models/subclass');
const Level = require('../../models/level');
const utility = require('./utility');

exports.index = (req, res, next) => {
  Subclass.find((err, _data) => {
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
  // search by class
  if (utility.isClassName(req.params.index) === true) {
    Subclass.find({ 'class.name': utility.upperFirst(req.params.index) }, (err, _data) => {
      if (err) {
        next(err);
      }
    })
      .sort({ url: 'asc', level: 'asc' })
      .exec((err, data) => {
        if (err) {
          next(err);
        }
        res.status(200).json(utility.NamedAPIResource(data));
      });
  } else if (utility.isSubclassName(req.params.index) === true) {
    Subclass.findOne({ name: utility.subclass_map[req.params.index] }, (err, _data) => {
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

exports.showLevelForClass = (req, res, next) => {
  if (typeof parseInt(req.params.level) == 'number') {
    let urlString = '/api/subclasses/' + req.params.index + '/level/' + req.params.level;
    console.log(urlString);

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

exports.showLevelsForClass = (req, res, next) => {
  Level.find({ 'subclass.name': utility.subclass_map[req.params.index] }, (err, _data) => {
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
