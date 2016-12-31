var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/equipment');

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

  if (utility.isEquipmentCategory(req.params.index) === true) {
    console.log(req.params.index)
    Model.find( { 'type': utility.equipment_map[req.params.index] }, (err,data) => {
      if (err) {
        res.send(err);
      }
    }).sort( {index: 'asc'} ).exec((err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(utility.NamedAPIResource(data));
    })
  } 

  else { // return specific document
    Model.findOne( { index: parseInt(req.params.index) }, (err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(data);
    })
  }
})

module.exports = router;