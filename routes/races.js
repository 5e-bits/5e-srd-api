var express = require('express'),
    router = express.Router()

var Race = require('../models/race');

let subfolder_name = "race-routes"

// Register race routes
router.use('/dwarf', require('./' + subfolder_name + '/dwarf'));
router.use('/elf', require('./' + subfolder_name + '/elf'));
router.use('/halfling', require('./' + subfolder_name + '/halfling'));
router.use('/human', require('./' + subfolder_name + '/human'));

router
.get('/', (req,res) => {
    Race.find((err,races) => {
        if (err) {
            res.send(err);
        }
    }).sort({name:'asc'}).exec((err,races) => {
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
  Race.findOne( { index: parseInt(req.params.index) }, (err,item) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(item);
  })
})

module.exports = router;