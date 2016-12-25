var express = require('express'),
    router = express.Router();

var StartingEquipment = require('../../models/startingequipment');

let class_name = "Bard"

// -------------------------------------
router.route('/')
.get((req,res) => {
  StartingEquipment.find({ class: class_name } , (err,startingequipment) => {
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