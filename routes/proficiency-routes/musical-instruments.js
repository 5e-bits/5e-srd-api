var express = require('express'),
    router = express.Router();

var Proficiency = require('../../models/proficiency');

var type_name = "Musical Instruments"

// -------------------------------------
router.route('/')
.get((req,res) => {
  Proficiency.find({ type: type_name } , (err,proficiencies) => {
    if (err) {
      res.send(err);
    }
  }).sort( {index : 'asc'} ).exec( (err, proficiencies) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(proficiencies);
  })

})

module.exports = router;