var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/monster');

router.get('/', (req, res, next) => {
  var search_queries = {};
  if (req.query.name !== undefined) {
    search_queries.name = req.query.name;
  }

  Model.find(search_queries, (err, _data) => {
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
  Model.findOne({ index: req.params.index }, (err, data) => {
    if (err) {
      next(err);
    }

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });
});

module.exports = router;
