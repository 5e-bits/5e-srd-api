var express = require('express')
var app = express()
var router = express.Router();

var db;

var mongoose   = require('mongoose');
mongoose.connect('mongodb://admin:password@ds133158.mlab.com:33158/5e-srd-api', (err, database) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  console.log("Database connection ready");

  var server = app.listen(process.env.PORT || 3000, () => {
    var port = server.address().port;
    console.log('Example app listening on port 3000!')
  })
}); // connect to our database

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
    res.json(spell);
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
// find monster by index in array
router.route('/monsters/:index')
.get((req,res) => {
  Monster.findOne( { index: parseInt(req.params.index) }, (err,monster) => {
    if (err) {
      res.send(err);
    }
    res.json(monster);
  })
})
// -------------------------------------

// register routes
app.use('/api', router);

