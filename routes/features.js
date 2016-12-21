var express = require('express'),
    router = express.Router(),
    app = express();

var ClassFeature = require('../models/classfeature');

// Reguster class routes
app.use("/barbarian", router);

// -------------------------------------
router.route('/features')
.get((req,res) => {
    ClassFeature.find((err,features) => {
      if (err) {
        res.send(err);
      }

      res.status(200).json(features);
    })
})


// -------------------------------------
router.route('/features/:index')
.get((req,res) => {
  ClassFeature.findOne( { index: parseInt(req.params.index) }, (err,feature) => {
    if (err) {
      res.send(err);
    }

    res.status(200).json(feature);
  })
})

module.exports = router;