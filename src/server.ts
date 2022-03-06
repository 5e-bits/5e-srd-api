import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { bugsnagMiddleware } from './middleware/bugsnag';
import { createApolloMiddleware } from './middleware/apolloServer';
import indexController from './controllers/indexController';
import docsController from './controllers/docsController';
import apiRoutes from './routes/api';

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 10000, // limit each IP to 10000 requests per windowMs
});

export default async () => {
  const app = express();

  // Middleware stuff
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  if (bugsnagMiddleware?.requestHandler) {
    app.use(bugsnagMiddleware.requestHandler);
  }

  app.use('/js', express.static(__dirname + '/js'));
  app.use('/css', express.static(__dirname + '/css'));
  app.use('/public', express.static(__dirname + '/public'));
  app.use(morgan('short'));
  // Enable all CORS requests
  app.use(cors());

  app.use(limiter);

  console.log('Setting up Apollo GraphQL server');
  const apolloMiddleware = await createApolloMiddleware();
  apolloMiddleware.applyMiddleware({ app });

  // Register routes
  app.get('/', indexController);
  app.get('/docs', docsController);
  app.use('/api', apiRoutes);

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

  if (bugsnagMiddleware?.errorHandler) {
    app.use(bugsnagMiddleware.errorHandler);
  }
  return app;
};
