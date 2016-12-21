let express = require('express'),
    router = express.Router();


var ClassFeature = require('../models/classfeature');
var barbarian_router = require('./class-feature-routes/barbarian');

// Register class routes
router.use('/barbarian', barbarian_router);


// -------------------------------------
router
.get('/', (req,res) => {
    ClassFeature.find((err,features) => {
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

console.log("is this first");
module.exports = router;