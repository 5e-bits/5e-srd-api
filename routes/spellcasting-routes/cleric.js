var express = require('express'),
    router = express.Router();

var Spellcasting = require('../../models/spellcasting');

// -------------------------------------
router.route('/')
.get((req,res) => {
  Spellcasting.findOne({ class: "Cleric" } , (err,classs) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(classs)
  })
})

module.exports = router;