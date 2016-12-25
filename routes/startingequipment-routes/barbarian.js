var express = require('express'),
    router = express.Router();

var StartingEquipment = require('../../models/startingequipment');

let class_name = "Barbarian"

// -------------------------------------
router.route('/')
.get((req,res) => {
  StartingEquipment.findOne({ class: class_name } , (err,startingequipment) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(startingequipment);
  })

})

module.exports = router;