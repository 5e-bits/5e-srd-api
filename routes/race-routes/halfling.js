var express = require('express'),
    router = express.Router();

var Trait = require('../../models/trait');
let race_name = "Halfling"

// -------------------------------------
router.route('/')
.get((req,res) => {
  Trait.findOne({ race: race_name } , (err,trait) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(trait)
  })
})

module.exports = router;
