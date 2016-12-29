var express = require('express'),
    router = express.Router()

var Subrace = require('../models/subrace');

let subfolder_name = "subrace-routes"

// Register race routes
router.use('/dwarf', require('./' + subfolder_name + '/dwarf'));
router.use('/elf', require('./' + subfolder_name + '/elf'));
router.use('/halfling', require('./' + subfolder_name + '/halfling'));
router.use('/human', require('./' + subfolder_name + '/human'));

router
.get('/', (req,res) => {
    Subrace.find((err,races) => {
        if (err) {
            res.send(err);
        }
    }).sort({index:'asc'}).exec((err,races) => {
        if (err) {
            res.send(err);
        }
        res.status(200).json(races);
    })
})

// -------------------------------------
// find rae by index in array
router
.get('/:index', (req,res) => {
  Subrace.findOne( { index: parseInt(req.params.index) }, (err,item) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(item);
  })
})

module.exports = router;