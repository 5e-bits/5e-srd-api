var express = require('express')
var app = express()
var router = express.Router();
var morgan = require('morgan');
var mongoose = require('mongoose');


// Middleware stuff
app.set('view engine', 'ejs');
app.use("/js", express.static(__dirname + '/js'));
app.use("/public", express.static(__dirname + '/public'));
app.use(morgan('short'));


// Register routes
app.use("/api/classes", require('./routes/classes'));
app.use("/api/spells", require('./routes/spells'));
app.use("/api/monsters", require('./routes/monsters'));
app.use("/api/features", require('./routes/features'));
app.use("/api/tables", require('./routes/tables'));
app.use("/api/equipment", require('./routes/equipment'));
app.use("/api/proficiencies", require('./routes/proficiencies'));

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

