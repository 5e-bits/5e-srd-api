var express = require('express'),
    router = express.Router();

var Trait = require('../../models/trait');
let race_name = "Elf"

// -------------------------------------
router.route('/')
.get((req,res) => {
  Trait.find({ race: race_name } , (err,traits) => {
    if (err) {
      res.send(err);
    }
  }).sort({index: 'asc'}).exec((err,traits)=> {
    if (err) {
      res.send(err);
    }
    res.status(200).json(traits)
  })
})

module.exports = router;
