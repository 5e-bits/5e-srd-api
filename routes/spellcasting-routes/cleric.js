var express = require('express'),
    router = express.Router();

var Spellcasting = require('../../models/spellcasting');
let class_name = "Cleric"

// -------------------------------------
router.route('/')
.get((req,res) => {
  Spellcasting.findOne({ class: class_name } , (err,classs) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(classs)
  })
})

module.exports = router;