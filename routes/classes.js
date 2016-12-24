var express = require('express'),
    router = express.Router()

var Class = require('../models/class');

// Register class routes
router.use('/barbarian', require('./class-routes/barbarian'));
router.use('/bard', require('./class-routes/bard'));
router.use('/cleric', require('./class-routes/cleric'));
router.use('/druid', require('./class-routes/druid'));

router
.get('/', (req,res) => {
    Class.find((err,classes) => {
        if (err) {
            res.send(err);
        }
    }).sort({name:'asc'}).exec((err,classes) => {
        if (err) {
            res.send(err);
        }
        res.status(200).json(classes);
    })
})

// -------------------------------------
// find class by index in array
router
.get('/:index', (req,res) => {
  Class.findOne( { index: parseInt(req.params.index) }, (err,item) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(item);
  })
})

module.exports = router;