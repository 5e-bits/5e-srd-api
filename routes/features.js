var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/feature');

router
.get('/', (req,res) => {

  Model.find((err,data) => {
    if (err) {
      res.send(err);
    }
  }).sort( { index: 'asc'} ).exec( (err, data) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(utility.NamedAPIResource(data));
  });
});



router
.get('/:index', (req,res) => {

  // search by class name
  if (utility.isClassName(req.params.index)) {
    Model.find( {class: utility.upperFirst(req.params.index)}, (err,data) => {
      if (err) {
        res.send(err);
      }
    }).sort( {url: 'asc', level: 'asc'} ).exec((err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(utility.NamedAPIResource(data));
    })
  } else { // return spcific document
    Model.findOne( { index: parseInt(req.params.index) }, (err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(data);
    })
  }
})

var levelRouter = express.Router({mergeParams: true});
router.use('/:index/level', levelRouter);

levelRouter
.get('/:level', (req, res) => {
  console.log(req.params)
  if (utility.isClassName(req.params.index)) {
    Model.find( {class: utility.upperFirst(req.params.index), level: parseInt(req.params.level)}, (err,data) => {
      if (err) {
        res.send(err);
      }
    }).sort( {url: 'asc', level: 'asc'} ).exec((err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(utility.NamedAPIResource(data));
    })
  }
})

module.exports = router;