const Class = require('../../models/class');
const Level = require('../../models/level');
const utility = require('./utility');

exports.index = async (req, res, next) => {
  await Class.find()
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.show = async (req, res, next) => {
  await Class.findOne({ index: req.params.index })
    .sort({ url: 'asc', level: 'asc' })
    .then(data => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(err => {
      next(err);
    });
};

exports.showLevelsForClass = async (req, res, next) => {
  await Level.find({ 'class.name': utility.class_map[req.params.index], subclass: {} })
    .sort({ level: 'asc' })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
};

exports.showLevelForClass = async (req, res, next) => {
  if (typeof parseInt(req.params.level) != 'number') {
    return res.status(404).json({ error: 'Not found' });
  }
  let urlString = '/api/classes/' + req.params.index + '/level/' + req.params.level;

  await Level.findOne({ url: urlString })
    .then(data => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(err => {
      next(err);
    });
};
