var express = require('express'),
    router = express.Router();

var Equipment = require('../../models/equipment');

var equipment_type = "Adventuring Gear"

// -------------------------------------
router.route('/')
.get((req,res) => {
  Equipment.find({ type: equipment_type } , (err,equipment) => {
    if (err) {
      res.send(err);
    }
  }).sort( {index : 'asc'} ).exec( (err, equipment) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(equipment);
  })

})

module.exports = router;