var express = require('express')
var app = express()
var router = express.Router();
var morgan = require('morgan');
var mongoose = require('mongoose');


// Middleware stuff
app.set('view engine', 'ejs');
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/public", express.static(__dirname + '/public'));
app.use(morgan('short'));


// Register routes
app.use("/api/classes", require('./routes/classes'));
app.use("/api/subclasses", require('./routes/subclasses'));
app.use("/api/spellcasting", require('./routes/spellcasting'));
app.use("/api/spells", require('./routes/spells'));
app.use("/api/monsters", require('./routes/monsters'));
app.use("/api/features", require('./routes/features'));
app.use("/api/tables", require('./routes/tables'));
app.use("/api/equipment", require('./routes/equipment'));
app.use("/api/proficiencies", require('./routes/proficiencies'));
app.use("/api/startingequipment", require('./routes/startingequipment'));

// Connect to database and start the server
mongoose.connect(process.env.MONGOLAB_URI, (err, database) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("Database connection ready");

  var server = app.listen(process.env.PORT || 3000, () => {
    var port = server.address().port;
    console.log('Example app listening on port 3000!')
  })
});

// index route at localhost:3000 or wherever it's served
app.get('/', (req, res) => {
  res.render('pages/index');
})

app.get('/documentation', (req, res) => {
  res.render('pages/documentation');
})

app.get('/api', (req, res) => {
  console.log("o hai");
  var index = {
    "classes": "http://swapi.co/api/classes/",
    "subclasses": "http://swapi.co/api/subclasses/",
    "spellcasting": "http://swapi.co/api/spellcasting/",
    "spells": "http://swapi.co/api/spells/",
    "monsters": "http://swapi.co/api/monsters/",
    "features": "http://swapi.co/api/features/",
    "tables": "http://swapi.co/api/tables/",
    "equipment": "http://swapi.co/api/equipment/",
    "proficiencies": "http://swapi.co/api/proficiencies/",
    "startingequipment": "http://swapi.co/api/startingequipment/"
  }
  res.status(200).json(index);
})

