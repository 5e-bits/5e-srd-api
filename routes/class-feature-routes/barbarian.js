var express = require('express'),
    router = express.Router();

var ClassFeature = require('../../models/classfeature');

// -------------------------------------
router.route('/')
.get((req,res) => {
  console.log("barb requested");
    ClassFeature.find({ class: "Barbarian" } , (err,features) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(features);
    })
})

module.exports = router;