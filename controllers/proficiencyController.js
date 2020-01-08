const Proficiency = require('../models/proficiency');
const utility = require('./utility');

exports.index = (req, res, next) => {
  Proficiency.find((err, _data) => {
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
  if (utility.isRaceName(req.params.index) === true) {
    Proficiency.find({ 'races.name': utility.upperFirst(req.params.index) }, (err, _data) => {
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
  } else if (utility.isSubraceName(req.params.index) === true) {
    Proficiency.find({ 'races.name': utility.subrace_map[req.params.index] }, (err, _data) => {
      if (err) {
        next(err);
      }
    })
      .sort({ url: 'asc' })
      .exec((err, data) => {
        if (err) {
          next(err);
        }
        res.status(200).json(utility.NamedAPIResource(data));
      });
  } else if (utility.isClassName(req.params.index) === true) {
    Proficiency.find({ 'classes.name': utility.upperFirst(req.params.index) }, (err, _data) => {
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
  } else if (utility.isProficiencyCategory(req.params.index) === true) {
    console.log(req.params.index);
    Proficiency.find({ type: utility.proficiency_map[req.params.index] }, (err, _data) => {
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
  } else {
    // return specific document
    Proficiency.findOne({ index: req.params.index }, (err, data) => {
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
