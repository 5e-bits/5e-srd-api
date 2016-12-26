var express = require('express'),
    router = express.Router();

var ClassTable = require('../../models/classtable');
let class_name = "Monk";

// -------------------------------------
router.route('/')
.get((req,res) => {
  ClassTable.findOne({ class: class_name } , (err,tables) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(tables);
  })
})

module.exports = router;