var express = require('express'),
    router = express.Router(),
    app = express();

var Monster = require('../models/monster');

// -------------------------------------
// add '/monsters' route
router.route('/monsters')
.get((req,res,next) => {

  let query_name = req.query.name;

  if (query_name === undefined) {
    Monster.find((err,monsters) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(monsters);
    })
  } else {
      Monster.findOne({ name: query_name }, (err,monster) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(monster);
    })
  }

})
// -------------------------------------
// find monster by index in array
router.route('/monsters/:index')
.get((req,res) => {
  Monster.findOne( { index: parseInt(req.params.index) }, (err,monster) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(monster);
  })
})
// -------------------------------------

module.exports = router;