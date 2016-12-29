var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/feature');

router
.get('/', (req,res) => {

  let query_name = req.query.name;
  let query_level = req.query.level;
  let query_class = req.query.class;

  let search_params = {};

  if (query_name !== undefined) {
    search_params.name = query_name;
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