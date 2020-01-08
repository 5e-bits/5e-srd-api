var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/race');

router.get('/', (req, res, next) => {
  Model.find((err, _data) => {
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
});

router.get('/:index', (req, res, next) => {
  // search by race
  if (utility.isRaceName(req.params.index) === true) {
    console.log('got here?');
    Model.findOne({ index: req.params.index }, (err, _data) => {
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
});

module.exports = router;
