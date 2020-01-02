var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/subrace');

router
.get('/', (req, res) => {
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
  // search by class
  if (utility.isRaceName(req.params.index) === true) {
    Model.find( { 'race.name': utility.upperFirst(req.params.index) }, (err,  _data) => {
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

  else { // return specific document
    Model.findOne( { index: parseInt(req.params.index) }, (err, data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(data);
    })
  }
})

module.exports = router;
