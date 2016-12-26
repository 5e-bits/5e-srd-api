var express = require('express'),
    router = express.Router();

var Table = require('../../models/table');
let class_name = "Paladin";

// -------------------------------------
router.route('/')
.get((req,res) => {
  Table.findOne({ class: class_name } , (err,tables) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(tables);
  })
})

module.exports = router;