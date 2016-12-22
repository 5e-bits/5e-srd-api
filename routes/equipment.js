var express = require('express'),
    router = express.Router(),
    app = express();

var Equipment = require('../models/equipment');

router.use('/weapons', require('./equipment-routes/weapons'));
router.use('/armor', require('./equipment-routes/armor'));

// -------------------------------------
// add '/equipment' route
router
.get('/', (req,res) => {

  let query_name = req.query.name;

  if (query_name !== undefined) {
    Equipment.findOne({ name: query_name }, (err,equipment) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(equipment);
    })
  } else {
    Equipment.find((err,equipment) => {
      if (err) {
        res.send(err);
      }
    }).sort( {index: 'asc'} ).exec( (err, equipment) => {
      res.status(200).json(equipment);
    })
  }

})
// -------------------------------------
// find equipment by index in array
router
.get('/equipment/:index', (req,res) => {
  Equipment.findOne( { index: parseInt(req.params.index) }, (err,equipment) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(equipment);
  })
})
// -------------------------------------

module.exports = router;