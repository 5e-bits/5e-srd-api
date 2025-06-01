import 'reflect-metadata' // Must be imported first

import path from 'path'
import { fileURLToPath } from 'url'

import { expressMiddleware } from '@apollo/server/express4'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import { buildSchema } from 'type-graphql'

import docsController from './controllers/docsController'
import { resolvers } from './graphql/2014/resolvers'
import { createApolloMiddleware } from './middleware/apolloServer'
import bugsnagMiddleware from './middleware/bugsnag'
import errorHandlerMiddleware from './middleware/errorHandler'
import apiRoutes from './routes/api'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const rateLimitWindowMs = process.env.RATE_LIMIT_WINDOW_MS
  ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)
  : 1000 // Default 1 second

const rateLimitMax = process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 50 // Default 50

const limiter = rateLimit({
  windowMs: rateLimitWindowMs,
  max: rateLimitMax,
  message: `Rate limit of ${rateLimitMax} requests per ${rateLimitWindowMs / 1000} second(s) exceeded, try again later.`
})

export default async () => {
  const app = express()

  // Middleware stuff
  if (bugsnagMiddleware) {
    app.use(bugsnagMiddleware.requestHandler)
  }

  app.use('/swagger', express.static(__dirname + '/swagger'))
  app.use('/js', express.static(__dirname + '/js'))
  app.use('/css', express.static(__dirname + '/css'))
  app.use('/public', express.static(__dirname + '/public'))
  app.use(morgan('short'))
  // Enable all CORS requests
  app.use(cors())

  app.use(limiter)

  console.log('Building TypeGraphQL schema...')
  const schema = await buildSchema({
    resolvers: resolvers,
    validate: { forbidUnknownValues: false }
  })
  console.log('TypeGraphQL schema built successfully.')

  console.log('Setting up Apollo GraphQL server')
  const apolloMiddleware2014 = await createApolloMiddleware(schema)
  await apolloMiddleware2014.start()
  app.all('/graphql', (_req, res) => res.redirect(301, '/graphql/2014'))
  app.use(
    '/graphql/2014',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(apolloMiddleware2014, {
      context: async ({ req }) => ({ token: req.headers.token })
    })
  )

  // Register routes
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
  })
  app.get('/docs', docsController)
  app.use('/api', apiRoutes)

  if (bugsnagMiddleware?.errorHandler) {
    app.use(bugsnagMiddleware.errorHandler)
  }

  app.use(errorHandlerMiddleware)
  return app
}
