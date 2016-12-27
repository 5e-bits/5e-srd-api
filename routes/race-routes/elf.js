var express = require('express'),
    router = express.Router();

var Race = require('../../models/race');
let race_name = "Elf"

// -------------------------------------
router.route('/')
.get((req,res) => {
  Race.findOne({ name: race_name } , (err,race) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(race)
  })
})

module.exports = router;