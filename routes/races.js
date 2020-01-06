var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/race');

router
.get('/', (req,res) => {
  Model.find((err, _data) => {
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
  // search by race
  if (utility.isRaceName(req.params.index) === true) {
    Model.findOne( { 'index': req.params.index }, (err, _data) => {
      if (err) {
        res.send(err);
      }
    }).sort( {url: 'asc', level: 'asc'} ).exec((err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(data);
    })
  } else {
    res.status(404)
  }
})

module.exports = router;
