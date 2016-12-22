var express = require('express'),
    router = express.Router(),
    app = express();

var Monster = require('../models/monster');

// -------------------------------------
// add '/monsters' route
router
.get('/', (req,res) => {

  let query_name = req.query.name;

  if (query_name !== undefined) {
    Monster.findOne({ name: query_name }, (err,monster) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(monster);
    })
  } else {
    Monster.find((err,monsters) => {
      if (err) {
        res.send(err);
      }
    }).sort( {index: 'asc'} ).exec( (err, monsters) => {
      res.status(200).json(monsters);
    })
  }

})
// -------------------------------------
// find monster by index in array
router
.get('/:index', (req,res) => {
  Monster.findOne( { index: parseInt(req.params.index) }, (err,monster) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(monster);
  })
})
// -------------------------------------

module.exports = router;