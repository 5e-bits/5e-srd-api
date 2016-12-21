var express = require('express'),
    router = express.Router(),
    app = express();

var Spell = require('../models/spell');

// -------------------------------------
// add '/spells' route
router
.get('/', (req,res) => {

  let query_name = req.query.name;
  let query_class = req.query.class;

  if (query_name !== undefined) {

    Spell.findOne({ name: query_name }, (err,spell) => {
      if (err) {
        res.send(err);
      }

      res.status(200).json(spell);
    })

  } else if (query_class !== undefined) {
    
    Spell.find({ class: {name: query_class}}, (err,spells) => {
      if (err) {
        res.send(err);
      }
    }).sort( {level: 'asc'} ).exec( (err, spells) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(spells);
    })

  } else {
    Spell.find((err,spells) => {
      if (err) {
        res.send(err);
      }
    }).sort( {index: 'asc'} ).exec( (err, spells) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(spells);
    })
  }

})


// -------------------------------------
// find spell by index in array
router
.get('/spells/:index', (req,res) => {
  Spell.findOne( { index: parseInt(req.params.index) }, (err,spell) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(spell);
  })
})

module.exports = router;