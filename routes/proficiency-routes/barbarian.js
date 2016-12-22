var express = require('express'),
    router = express.Router();

var Proficiency = require('../../models/proficiency');

// -------------------------------------
router.route('/')
.get((req,res) => {
  Proficiency.find({ classes: "http://dnd5eapi.co/api/classes/1" } , (err,proficiencies) => {
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