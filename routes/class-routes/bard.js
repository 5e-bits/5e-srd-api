var express = require('express'),
    router = express.Router();

var Class = require('../../models/class');

// -------------------------------------
router.route('/')
.get((req,res) => {
  Class.find({ name: "Bard" } , (err,classs) => {
    if (err) {
      res.send(err);
    }
  }).sort( {level : 'asc'} ).exec( (err, classs) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(classs);
  })

})

module.exports = router;