import apiRoutes from './routes/api.js';
import bugsnagMiddleware from './middleware/bugsnag.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createApolloMiddleware } from './middleware/apolloServer.js';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import docsController from './controllers/docsController.js';
import path from 'path';
import rateLimit from 'express-rate-limit';
import schema2014 from './graphql/2014/schema.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Rate limit of 50 requests per second exceeded, try again in a second',
});

export default async () => {
  const app = express();

  // Middleware stuff
  if (bugsnagMiddleware) {
    app.use(bugsnagMiddleware.requestHandler);
  }

  app.use('/swagger', express.static(__dirname + '/swagger'));
  app.use('/js', express.static(__dirname + '/js'));
  app.use('/css', express.static(__dirname + '/css'));
  app.use('/public', express.static(__dirname + '/public'));
  app.use(morgan('short'));
  // Enable all CORS requests
  app.use(cors());

  app.use(limiter);

  console.log('Setting up Apollo GraphQL server');
  const apolloMiddleware2014 = await createApolloMiddleware(schema2014);
  await apolloMiddleware2014.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(apolloMiddleware2014, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );
  app.use(
    '/graphql/2014',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(apolloMiddleware2014, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  // Register routes
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
  app.get('/docs', docsController);
  app.use('/api', apiRoutes);

  if (bugsnagMiddleware?.errorHandler) {
    app.use(bugsnagMiddleware.errorHandler);
  }

  if (errorHandlerMiddleware) {
    app.use(errorHandlerMiddleware);
  }
  return app;
};
