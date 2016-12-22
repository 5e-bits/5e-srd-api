var express = require('express'),
    router = express.Router();

var Equipment = require('../../models/equipment');

// -------------------------------------
router.route('/')
.get((req,res) => {
  Equipment.find({ type: "Armor" } , (err,equipment) => {
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