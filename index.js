var express = require('express')
var app = express()
var router = express.Router();

var mongoose   = require('mongoose');
mongoose.connect('mongodb://admin:password@ds133158.mlab.com:33158/5e-srd-api'); // connect to our database

var Spell = require('./models/spell');
var Monster = require('./models/monster');

// middleware to log activity
router.use( (req, res, next) => {
  console.log("Something is happening");
  next();
})

// test route at localhost:3000
router.get('/', function (req, res) {
  res.json( {message: 'Hello World!'} )
})

// -------------------------------------
// add '/spells' route
router.route('/spells')
.get((req,res,next) => {
  Spell.find((err,spells) => {
    if (err) {
      res.send(err);
    }
    res.json(spells);
  })
})


// -------------------------------------
// find spell by index in array
router.route('/spells/:index')
.get((req,res) => {
  Spell.findOne( { index: parseInt(req.params.index) }, (err,spell) => {
    if (err) {
      res.send(err);
    }
    res.send(spell.desc);
  })
})



// -------------------------------------
// add '/monsters' route
router.route('/monsters')
.get((req,res,next) => {
  Monster.find((err,monsters) => {
    if (err) {
      res.send(err);
    }
    res.json(monsters);
  })
})

// -------------------------------------

// register routes
app.use('/api', router);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})