let express = require('express'),
    router = express.Router();

var ClassFeature = require('../models/classfeature');

// Register class routes
router.use('/barbarian', require('./class-feature-routes/barbarian'));


// -------------------------------------
router
.get('/', (req,res) => {
    ClassFeature.find((err,features) => {
      if (err) {
        res.send(err);
      }
    }).sort( { index: 'asc'} ).exec( (err, features) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(features);
    })
})

// -------------------------------------
router
.get('/:index', (req,res) => {
  ClassFeature.findOne( { index: parseInt(req.params.index) }, (err,feature) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(feature);
  })
})

module.exports = router;