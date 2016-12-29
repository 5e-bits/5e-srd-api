var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/spell');

router
.get('/', (req,res) => {

  let query_name = req.query.name;
  let query_school = req.query.school;
  let query_level = req.query.level;
  let query_class = req.query.class;

  let search_params = {};

  if (query_name !== undefined) {
    search_params.name = query_name;
  }
  if (query_school !== undefined) {
    search_params.school = query_school;
  }
  if (query_level !== undefined) {
    search_params.level = parseInt(query_level);
  }
  if (query_class !== undefined) {
    search_params.classes = utility.classToURL(query_class);
  }

  Model.find(search_params, (err,data) => {
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

// -------------------------------------
// find spell by index in array
router
.get('/:index', (req,res) => {

  if (utility.isClassName(req.params.index)) {
    Model.find( {classes: utility.classToURL(req.params.index)}, (err,data) => {
      if (err) {
        res.send(err);
      }
    }).sort( {name: 'asc', level: 'asc'} ).exec((err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(utility.NamedAPIResource(data));
    })
  } else {
    Model.findOne( { index: parseInt(req.params.index) }, (err,data) => {
      if (err) {
        res.send(err);
      }
      let response = {
        count: data.length,
        results: data.map((item) => {
          return {
            name: item.name,
            url: item.url
          }
        })
      }
      res.status(200).json(data);
    })
  }

})

module.exports = router;