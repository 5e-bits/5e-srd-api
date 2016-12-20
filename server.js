var express = require('express')
var app = express()
var router = express.Router();
var morgan = require('morgan');
var mongoose = require('mongoose');

var db;

mongoose.connect('mongodb://admin:password@ds133158.mlab.com:33158/5e-srd-api', (err, database) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  app.set('view engine', 'ejs');
  app.use("/js", express.static(__dirname + '/js'));
  app.use("/public", express.static(__dirname + '/public'));

  db = database;
  console.log("Database connection ready");

  var server = app.listen(process.env.PORT || 3000, () => {
    var port = server.address().port;
    console.log('Example app listening on port 3000!')
  })
}); // connect to our database

app.use(morgan('short'));

// test route at localhost:3000
app.get('/', (req, res) => {
  res.render('pages/index');
})

// set up models
var Spell = require('./models/spell');
var Monster = require('./models/monster');

// -------------------------------------
// add '/spells' route
router.route('/spells')
.get((req,res) => {

  let query_name = req.query.name;

  if (query_name === undefined) {
    Spell.find((err,spells) => {
      if (err) {
        res.send(err);
      }

      res.status(200).json(spells);
    })
  } else {
    Spell.findOne({ name: query_name }, (err,spell) => {
      if (err) {
        res.send(err);
      }

      res.status(200).json(spell);
    })
  }

})


// -------------------------------------
// find spell by index in array
router.route('/spells/:index')
.get((req,res) => {
  Spell.findOne( { index: parseInt(req.params.index) }, (err,spell) => {
    if (err) {
      res.send(err);
    }

    res.status(200).json(spell);
  })
})


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

// register routes
app.use('/api', router);

