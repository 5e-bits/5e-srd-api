var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/language');

router.get('/', (req, res) => {
  Model.find((err, _data) => {
    if (err) {
      res.send(err);
    }
  })
    .sort({ index: 'asc' })
    .exec((err, data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(utility.NamedAPIResource(data));
    });
});

router.get('/:index', (req, res) => {
  Model.findOne({ index: req.params.index }, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(data);
  });
});

module.exports = router;
