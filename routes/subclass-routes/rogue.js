var express = require('express'),
    router = express.Router();

var Subclass = require('../../models/subclass');

let class_name = "Rogue"

// -------------------------------------
router.route('/')
.get((req,res) => {
  Subclass.find({ class: class_name } , (err,subclasses) => {
    if (err) {
      res.send(err);
    }
  }).sort( {level : 'asc'} ).exec( (err, subclasses) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(subclasses);
  })

})

module.exports = router;