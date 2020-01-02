var express = require('express');
var router = express.Router();
var utility = require('./utility');
var Model = require('../models/subclass');

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
  // search by class
  if (utility.isClassName(req.params.index) === true) {
    Model.find( { 'class.name': utility.upperFirst(req.params.index) }, (err, _data) => {
      if (err) {
        res.send(err);
      }
    }).sort( {url: 'asc', level: 'asc'} ).exec((err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(utility.NamedAPIResource(data));
    })
  } else if (utility.isSubclassName(req.params.index) === true) {
    Model.findOne( { 'name': utility.subclass_map[req.params.index] }, (err, _data) => {
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

const levelRouter = express.Router({mergeParams: true});
router.use('/:index/level', levelRouter);
var LevelModel = require('../models/level');

levelRouter
.get('/:level', (req, res) => {


  if (typeof(parseInt(req.params.level)) == 'number') {

    let urlString = "/api/subclasses/" + req.params.index + "/level/" + req.params.level;
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

// TODO: Is a second necessary?
const levelRouter2 = express.Router({mergeParams: true});
router.use('/:index/levels', levelRouter2);

levelRouter2
.get('/', (req, res) => {
    LevelModel.find({'subclass.name': utility.subclass_map[req.params.index]}, (err, _data) => {
      if (err) {
        res.send(err);
      }
    }).sort( {level: 'asc'} ).exec((err,data) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(data);
    })

})

module.exports = router;
