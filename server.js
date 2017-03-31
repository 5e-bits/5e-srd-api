var express = require('express')
var app = express()
var router = express.Router();
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cors = require('cors')


// Middleware stuff
app.set('view engine', 'ejs');
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/public", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(morgan('short'));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(cors({credentials: true, origin: true}));


// Register routes
app.use("/api/classes", require('./routes/classes'));
app.use("/api/subclasses", require('./routes/subclasses'));
app.use("/api/spellcasting", require('./routes/spellcasting'));
app.use("/api/spells", require('./routes/spells'));
app.use("/api/monsters", require('./routes/monsters'));
app.use("/api/features", require('./routes/features'));
app.use("/api/equipment", require('./routes/equipment'));
app.use("/api/proficiencies", require('./routes/proficiencies'));
app.use("/api/startingequipment", require('./routes/startingequipment'));
app.use("/api/races", require('./routes/races'));
app.use("/api/subraces", require('./routes/subraces'));
app.use("/api/traits", require('./routes/traits'));
app.use("/api/languages", require('./routes/languages'));
app.use("/api/damage-types", require('./routes/damage-types'));
app.use("/api/magic-schools", require('./routes/magic-schools'));
app.use("/api/conditions", require('./routes/conditions'));
app.use("/api/ability-scores", require('./routes/ability-scores'));
app.use("/api/skills", require('./routes/skills'));
app.use("/api/weapon-properties", require('./routes/weapon-properties'));
app.use("/api/equipment-categories", require('./routes/equipment-categories'));


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
    res.render('pages/docs');
})

app.get('/api', (req, res) => {
  res.status(200).json(index);
})

