var express = require('express'),
    router = express.Router(),
    app = express();

var Spell = require('../models/spell');

let subfolder_name = "spell-routes"

// Register class routes
router.use('/bard', require('./' + subfolder_name + '/bard'));
router.use('/cleric', require('./' + subfolder_name + '/cleric'));
router.use('/druid', require('./' + subfolder_name + '/druid'));
router.use('/paladin', require('./' + subfolder_name + '/paladin'));
router.use('/ranger', require('./' + subfolder_name + '/ranger'));
router.use('/sorcerer', require('./' + subfolder_name + '/sorcerer'));
router.use('/warlock', require('./' + subfolder_name + '/warlock'));
router.use('/wizard', require('./' + subfolder_name + '/wizard'));

// -------------------------------------
// add '/spells' route
router
.get('/', (req,res) => {

  let query_name = req.query.name;
  let query_class = req.query.class;
  let query_level = req.query.level;

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

  } else if (query_level !== undefined) {
    
    Spell.find({ level: parseInt(query_level) }, (err,spells) => {
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
.get('/:index', (req,res) => {
  Spell.findOne( { index: parseInt(req.params.index) }, (err,spell) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(spell);
  })
})

module.exports = router;