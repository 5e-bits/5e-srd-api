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
app.use('/api', require('./routes/api'));

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
