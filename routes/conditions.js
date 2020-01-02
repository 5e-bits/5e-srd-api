var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/condition');

router
.get('/', (req,res) => {

  var search_queries = {}
  if (req.query.name !== undefined) {
    search_queries.name = req.query.name
  }

  Model.find(search_queries, (err, _data) => {
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

    Model.findOne( { index: parseInt(req.params.index) }, (err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(data);
    })
  }
)

module.exports = router;
