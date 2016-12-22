var express = require('express'),
    router = express.Router();

var ClassTable = require('../../models/classtable');

// -------------------------------------
router.route('/')
.get((req,res) => {
  ClassTable.find({ class: "Bard" } , (err,tables) => {
    if (err) {
      res.send(err);
    }
  }).sort( {level : 'asc'} ).exec( (err, tables) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(tables);
  })

})

module.exports = router;