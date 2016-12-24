var express = require('express'),
    router = express.Router()

var Subclasses = require('../models/subclass');

// Register class routes
router.use('/barbarian', require('./subclass-routes/barbarian'));
router.use('/bard', require('./subclass-routes/bard'));
router.use('/cleric', require('./subclass-routes/cleric'));
router.use('/druid', require('./subclass-routes/druid'));

router
.get('/', (req,res) => {
    Subclasses.find((err,subclasses) => {
        if (err) {
            res.send(err);
        }
    }).sort({name:'asc'}).exec((err,subclasses) => {
        if (err) {
            res.send(err);
        }
        res.status(200).json(subclasses);
    })
})

// -------------------------------------
// find class by index in array
router
.get('/:index', (req,res) => {
  Subclasses.findOne( { index: parseInt(req.params.index) }, (err,item) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(item);
  })
})

module.exports = router;