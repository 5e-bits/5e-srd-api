let express = require('express'),
    router = express.Router();

var Proficiency = require('../models/proficiency');

// Register class routes
router.use('/barbarian', require('./proficiency-routes/barbarian'));
router.use('/bard', require('./proficiency-routes/bard'));
router.use('/cleric', require('./proficiency-routes/cleric'));

// -------------------------------------
router
.get('/', (req,res) => {
    Proficiency.find((err,proficiencies) => {
      if (err) {
        res.send(err);
      }
    }).sort( { index: 'asc'} ).exec( (err, proficiencies) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(proficiencies);
    })
})

// -------------------------------------
router
.get('/:index', (req,res) => {
  Proficiency.findOne( { index: parseInt(req.params.index) }, (err,proficiency) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(proficiency);
  })
})

module.exports = router;