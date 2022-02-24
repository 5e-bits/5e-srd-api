import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { bugsnagMiddleware } from './middleware/bugsnag';
import { createApolloMiddleware } from './middleware/apolloServer';

export default async () => {
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

  console.log('Setting up Apollo GraphQL server');
  const apolloMiddleware = await createApolloMiddleware();
  apolloMiddleware.applyMiddleware({ app });

  // Register routes
  app.get('/', require('./controllers/indexController'));
  app.get('/docs', require('./controllers/docsController'));
  app.use('/api', require('./routes/api'));

  app.use(function(req: express.Request, res: express.Response) {
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
