var express = require('express'),
    router = express.Router();

var Spell = require('../../models/spell');

let class_url = "http://dnd5eapi.co/api/classes/2"

// -------------------------------------
router.route('/')
.get((req,res) => {
    Spell.find({ classes: class_url } , (err,spells) => {
        if (err) {
            res.send(err);
        }
    }).sort( {level : 'asc'} ).exec( (err, spells) => {
        if (err) {
            res.send(err);
        }
        res.status(200).json(spells);
    })
})

// get by level
router
.get('/:level', (req,res) => {
  Spell.find( { level: parseInt(req.params.level), classes: class_url }, (err,spells) => {
    if (err) {
      res.send(err);
    }
  }).sort( {name: 'asc'} ).exec( (err, spells) => {
      if (err) {
          res.send(err);
      }
    res.status(200).json(spells);
  })
})


module.exports = router;