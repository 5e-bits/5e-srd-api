var express = require('express'),
    router = express.Router();

var Subrace = require('../../models/subrace');
let subrace_url = "http://dnd5eapi.co/races/1";

// -------------------------------------
router.route('/')
.get((req,res) => {
  Subrace.findOne({ race: subrace_url } , (err,subrace) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(subrace)
  })
})

module.exports = router;