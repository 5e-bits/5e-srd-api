var express = require('express'),
    router = express.Router();

var Subclass = require('../../models/subclass');

// -------------------------------------
router.route('/')
.get((req,res) => {
  Subclass.find({ class: "Druid" } , (err,subclasses) => {
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