var express = require('express'),
    router = express.Router();

var ClassFeature = require('../../models/classfeature');

// -------------------------------------
router.route('/')
.get((req,res) => {

  let query_subclass = req.query.subclass;

  if (query_subclass !== undefined) {
    ClassFeature.find({ class: "Barbarian", subclass: query_subclass } , (err,features) => {
      if (err) {
        res.send(err);
      }

    }).sort( {index : 'asc'} ).exec( (err, features) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(features);
    })
  } else {
    ClassFeature.find({ class: "Bard" } , (err,features) => {
      if (err) {
        res.send(err);
      }

    }).sort( {index : 'asc'} ).exec( (err, features) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json(features);
    })
  }

})

module.exports = router;