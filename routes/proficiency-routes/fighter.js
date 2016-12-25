var express = require('express'),
    router = express.Router();

var Proficiency = require('../../models/proficiency');

var class_url = "http://dnd5eapi.co/api/classes/5"

// -------------------------------------
router.route('/')
.get((req,res) => {
  Proficiency.find({ classes: class_url } , (err,proficiencies) => {
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