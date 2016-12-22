var express = require('express'),
    router = express.Router();

var StartingEquipment = require('../../models/startingequipment');

// -------------------------------------
router.route('/')
.get((req,res) => {
  StartingEquipment.find({ class: "Bard" } , (err,startingequipment) => {
    if (err) {
      res.send(err);
    }
  }).sort( {index : 'asc'} ).exec( (err, startingequipment) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(startingequipment);
  })

})

module.exports = router;