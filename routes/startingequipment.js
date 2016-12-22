let express = require('express'),
    router = express.Router();

var StartingEquipment = require('../models/startingequipment');

// Register class routes
router.use('/barbarian', require('./startingequipment-routes/barbarian'));
router.use('/bard', require('./startingequipment-routes/bard'));

// -------------------------------------
router
.get('/', (req,res) => {
    StartingEquipment.find((err,startingequipment) => {
      if (err) {
        res.send(err);
      }
    }).sort( { index: 'asc'} ).exec( (err, startingequipment) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(startingequipment);
    })
})

// -------------------------------------
router
.get('/:index', (req,res) => {
  StartingEquipment.findOne( { index: parseInt(req.params.index) }, (err,startingequipment) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(startingequipment);
  })
})

module.exports = router;