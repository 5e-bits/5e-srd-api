const Subclass = require('../../models/subclass');
const Level = require('../../models/level');
const utility = require('./utility');

exports.index = async (req, res, next) => {
  const search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = req.query.name;
  }

  await Subclass.find(search_queries)
    .sort({ index: 'asc' })
    .then(data => {
      res.status(200).json(utility.NamedAPIResource(data));
    })
    .catch(err => {
      next(err);
    });
};

exports.show = (req, res, next) => {
  // TODO: Move this out of here
  if (utility.isClassName(req.params.index) === true) {
    Subclass.find({ 'class.name': utility.class_map[req.params.index] }, (err, _data) => {
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
