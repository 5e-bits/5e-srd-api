var express = require('express'),
    router = express.Router();

var Class = require('../../models/class');
let class_name = "Monk"

// -------------------------------------
router.route('/')
.get((req,res) => {
  Class.findOne({ name: class_name } , (err,classs) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(classs)
  })
})

module.exports = router;