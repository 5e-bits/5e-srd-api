var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/spell');

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
  // search by class
  if (utility.isClassName(req.params.index) === true) {
    Model.find({ 'classes.name': utility.upperFirst(req.params.index) }, (err, _data) => {
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
  } else {
    // return specific document
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
  }
});

var levelRouter = express.Router({ mergeParams: true });
router.use('/:index/level', levelRouter);
levelRouter.get('/:level', (req, res, next) => {
  if (typeof parseInt(req.params.level) == 'number') {
    Model.find(
      {
        'classes.name': utility.upperFirst(req.params.index),
        level: parseInt(req.params.level)
      },
      (err, _data) => {
        if (err) {
          next(err);
        }
      }
    )
      .sort({ url: 'asc', level: 'asc' })
      .exec((err, data) => {
        if (err) {
          next(err);
        }
        res.status(200).json(utility.NamedAPIResource(data));
      });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router;
