const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { bugsnagMiddleware } = require('./middleware/bugsnag');
const { createApolloMiddleware } = require('./middleware/apolloServer');

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1000, // limit each IP to 10000 requests per windowMs
});

const createApp = async () => {
  const app = express();
  // enable cors in preflight
  app.options('*', cors());

  // Middleware stuff
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  app.use(bugsnagMiddleware.requestHandler);
  app.use('/js', express.static(__dirname + '/js'));
  app.use('/css', express.static(__dirname + '/css'));
  app.use('/public', express.static(__dirname + '/public'));
  app.use(morgan('short'));
  app.use(cors({ origin: '*' }));

  app.use(limiter);

  console.log('Setting up Apollo GraphQL server');
  const apolloMiddleware = await createApolloMiddleware();
  apolloMiddleware.applyMiddleware({ app });

  // Register routes
  app.get('/', require('./controllers/indexController'));
  app.get('/docs', require('./controllers/docsController'));
  app.use('/api', require('./routes/api'));

  app.use(function(req, res, _next) {
    res.status(404);

    // TODO: Add a fun 404 page
    // // respond with html page
    // if (req.accepts('html')) {
    //   res.render('404', { url: req.url });
    //   return;
    // }

    // default respond with json
    return res.send({ error: 'Not found' });
  });

  app.use(bugsnagMiddleware.errorHandler);
  return app;
};

// module.exports = app;
module.exports = createApp;
