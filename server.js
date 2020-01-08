const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { mongodbUri } = require('./util');
const { bugsnagMiddleware } = require('./bugsnag');

// enable cors in preflight
app.options('*', cors());

// Middleware stuff
app.set('view engine', 'ejs');
app.use(bugsnagMiddleware.requestHandler);
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('short'));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(cors());

// Register routes
app.use('/api/classes', require('./routes/classes'));
app.use('/api/subclasses', require('./routes/subclasses'));
app.use('/api/spellcasting', require('./routes/spellcasting'));
app.use('/api/spells', require('./routes/spells'));
app.use('/api/monsters', require('./routes/monsters'));
app.use('/api/features', require('./routes/features'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/proficiencies', require('./routes/proficiencies'));
app.use('/api/startingequipment', require('./routes/startingequipment'));
app.use('/api/races', require('./routes/races'));
app.use('/api/subraces', require('./routes/subraces'));
app.use('/api/traits', require('./routes/traits'));
app.use('/api/languages', require('./routes/languages'));
app.use('/api/damage-types', require('./routes/damage-types'));
app.use('/api/magic-schools', require('./routes/magic-schools'));
app.use('/api/conditions', require('./routes/conditions'));
app.use('/api/ability-scores', require('./routes/ability-scores'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/weapon-properties', require('./routes/weapon-properties'));
app.use('/api/equipment-categories', require('./routes/equipment-categories'));

// Connect to database and start the server
mongoose.connect(mongodbUri, (err, _database) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log('Database connection ready');

  const server = app.listen(process.env.PORT || 3000, () => {
    const port = server.address().port;
    console.log(`Listening on port ${port}!`);
  });
});

// index route at localhost:3000 or wherever it's served
app.get('/', (req, res, _next) => {
  res.render('pages/index');
});

app.get('/docs', (req, res, _next) => {
  res.render('pages/docs');
});

app.get('/api', (req, res, _next) => {
  // TODO: Find a way to generate this list.
  var index = {
    'ability-scores': '/api/ability-scores',
    classes: '/api/classes',
    conditions: '/api/conditions',
    'damage-types': '/api/damage-types',
    'equipment-categories': '/api/equipment-categories',
    equipment: '/api/equipment',
    features: '/api/features',
    languages: '/api/languages',
    'magic-schools': '/api/magic-schools',
    monsters: '/api/monsters',
    proficiencies: '/api/proficiencies',
    races: '/api/races',
    skills: '/api/skills',
    spellcasting: '/api/spellcasting',
    spells: '/api/spells',
    startingequipment: '/api/startingequipment',
    subclasses: '/api/subclasses',
    subraces: '/api/subraces',
    traits: '/api/traits',
    'weapon-properties': '/api/weapon-properties'
  };
  res.status(200).json(index);
});

app.use(function(req, res, _next) {
  res.status(404);

  // TODO: Add a fun 404 page
  // // respond with html page
  // if (req.accepts('html')) {
  //   res.render('404', { url: req.url });
  //   return;
  // }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.use(bugsnagMiddleware.errorHandler);
