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

app.get('/docs', (req, res) => {


    var classes = [
     {"name" : "Barbarian", "link": "classes/barbarian"}, 
     {"name" : "Bard", "link": "classes/bard"}, 
     {"name" : "Cleric", "link": "classes/cleric"}, 
     {"name" : "Druid", "link": "classes/druid"}, 
     {"name" : "Fighter", "link": "classes/fighter"}, 
     {"name" : "Monk", "link": "classes/monk"}, 
     {"name" : "Paladin", "link": "classes/paladin"}, 
     {"name" : "Ranger", "link": "classes/ranger"}, 
     {"name" : "Rogue", "link": "classes/rogue"}, 
     {"name" : "Sorcerer", "link": "classes/sorcerer"}, 
     {"name" : "Warlock", "link": "classes/warlock"}, 
     {"name" : "Wizard", "link": "classes/wizard"}
      ];

      var attributes_classes = [
        {"name": "index", "type":"string", "desc": "The class index for shorthand searching."},
        {"name": "name", "type":"string", "desc": "The name of the class."},
        {"name": "hit_die", "type":"number", "desc": "The hit die of the class. (ex: 12 == 1d12)"},
        {"name": "starting_proficiencies", "type":"array", "desc": "An array representing starting proficiencies where the player gets to choose from a certain type of proficiency."},
        {"name": "proficiencies", "type":"array", "desc": "All the available proficiencies to the class"},
        {"name": "starting_equipment", "type":"array", "desc": "An array of all the item sets that a player character starts with. Nested arrays represent the choices within each set."},
        {"name": "class_table", "type":"array", "desc": "The table showing the class' stats as the player gains class levels"},
        {"name": "features", "type":"array", "desc": "An array of all the features that this class can learn."},
        {"name": "subclasses", "type":"array", "desc": "An array of available subclasses for this class."},
        {"name": "spellcasting", "type":"object", "desc": "The reference object for the class's spellcasting. Contains information such as spells known, spellcasting ability, and cantrips known."},
        {"name": "url", "type":"string", "desc": "the hypermedia URL of this resource"}
      ];

    res.render('pages/docs', {
        classes: classes,
        attributes_classes: attributes_classes
    });
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

