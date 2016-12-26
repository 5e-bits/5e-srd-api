var express = require('express'),
    router = express.Router();

var Feature = require('../../models/feature');

var class_name = "Sorcerer"

// -------------------------------------
router.route('/')
.get((req,res) => {
  Feature.find({class: class_name}, (err, features) => {
    if (err) {
      res.send(err);
    }
  }).sort({level: 'asc'}).exec((err, features) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(features);
  })

})

router.route('/level/:level')
.get((req,res) => {
  Feature.find({class: class_name, level: parseInt(req.params.level) }, (err, features) => {
    if (err) {
      res.send(err);
    }
  }).sort({index: 'asc'}).exec((err, features) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(features);
  })

})


module.exports = router;