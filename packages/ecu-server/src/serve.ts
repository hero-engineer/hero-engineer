import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { ApolloServer } from 'apollo-server-express'
import express from 'express'
// @ts-expect-error
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import cors from 'cors'
import chalk from 'chalk'

import { resolvers, typeDefs } from './graphql/index.js'

import buildGraph from './graph/build/index.js'

import getEcuLocation from './helpers/getEcuLocation.js'

async function serve() {
  await buildGraph()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
  })

  await server.start()

  const graphqlApp = express()

  graphqlApp.use(cors())
  graphqlApp.use(graphqlUploadExpress())

  server.applyMiddleware({ app: graphqlApp })

  await new Promise<void>(resolve => {
    graphqlApp.listen({ port: 4000 }, resolve)
  })

  console.log(chalk.green('~~~'), '🚀 Ecu GraphQL server ready at http://localhost:4000/')

  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const staticApp = express()

  staticApp.use(cors())
  staticApp.use('/.ecu', express.static(getEcuLocation()))
  staticApp.use('/emojis', express.static(path.join(__dirname, '../data/emojis')))

  staticApp.listen(4001)

  console.log(chalk.green('~~~'), '🚀 Ecu static  server ready at http://localhost:4001/')
}

export default serve
