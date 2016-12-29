var express = require('express'),
    router = express.Router()

var Trait = require('../models/trait');

let subfolder_name = "trait-routes"

// Register race routes
router.use('/dwarf', require('./' + subfolder_name + '/dwarf'));
router.use('/elf', require('./' + subfolder_name + '/elf'));
router.use('/halfling', require('./' + subfolder_name + '/halfling'));
router.use('/human', require('./' + subfolder_name + '/human'));

router
.get('/', (req,res) => {
    Trait.find((err,traits) => {
        if (err) {
            res.send(err);
        }
    }).sort({index:'asc'}).exec((err,traits) => {
        if (err) {
            res.send(err);
        }
        res.status(200).json(traits);
    })
})

// -------------------------------------
// find rae by index in array
router
.get('/:index', (req,res) => {
  Trait.findOne( { index: parseInt(req.params.index) }, (err,item) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(item);
  })
})

module.exports = router;
