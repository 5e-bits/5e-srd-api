const express = require('express');
const router = express.Router();
const utility = require('./utility');
const Model = require('../models/class');

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
  if (utility.isClassName(req.params.index) === true) {
    Model.findOne({ name: utility.upperFirst(req.params.index) }, (err, _data) => {
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

const levelRouter = express.Router({ mergeParams: true });
router.use('/:index/level', levelRouter);
const LevelModel = require('../models/level');

levelRouter.get('/:level', (req, res, next) => {
  if (typeof parseInt(req.params.level) == 'number') {
    let urlString = '/api/classes/' + req.params.index + '/level/' + req.params.level;

    LevelModel.findOne({ url: urlString }, (err, data) => {
      if (err) {
        next(err);
      }
      res.status(200).json(data);
    });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// TODO: Is a second necessary?
const levelRouter2 = express.Router({ mergeParams: true });
router.use('/:index/levels', levelRouter2);

levelRouter2.get('/', (req, res, next) => {
  LevelModel.find(
    { 'class.name': utility.class_map[req.params.index], subclass: {} },
    (err, _data) => {
      if (err) {
        next(err);
      }
    }
  )
    .sort({ level: 'asc' })
    .exec((err, data) => {
      if (err) {
        next(err);
      }
      res.status(200).json(data);
    });
});
module.exports = router;
