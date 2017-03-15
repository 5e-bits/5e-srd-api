var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/class');

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
  // search by race 
  if (utility.isClassName(req.params.index) === true) {
    Model.findOne( { 'name': utility.upperFirst(req.params.index) }, (err,data) => {
      if (err) {
        res.send(err);
      }
    }).sort( {url: 'asc', level: 'asc'} ).exec((err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(data);
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

levelRouter = express.Router({mergeParams: true});
router.use('/:index/level', levelRouter);
var LevelModel = require('../models/level');

levelRouter
.get('/:level', (req, res) => {
  
  console.log(req.params.index);

  if (typeof(parseInt(req.params.level) == Number)) {
    

    let urlString = "http://dnd5eapi.co/api/classes/" + req.params.index + "/level/" + req.params.level;
    console.log(urlString);
    
    LevelModel.findOne({'url': urlString}, (err,data) => {
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
