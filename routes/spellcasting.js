var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/spellcasting');

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
      res.status(200).json(utility.ClassAPIResource(data));
    });
});

router.get('/:index', (req, res, next) => {
  // search by class
  if (utility.isClassName(req.params.index) === true) {
    Model.findOne({ 'class.name': utility.upperFirst(req.params.index) }, (err, _data) => {
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
    Model.findOne({ index: parseInt(req.params.index) }, (err, data) => {
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
});

module.exports = router;
