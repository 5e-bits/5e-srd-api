var express = require('express'),
    router = express.Router();

var Class = require('../../models/class');

// -------------------------------------
router.route('/')
.get((req,res) => {
  Class.findOne({ name: "Cleric" } , (err,classs) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(classs)
  })
})

module.exports = router;