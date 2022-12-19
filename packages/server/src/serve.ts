import { ApolloServer } from 'apollo-server-express'
import express from 'express'
// @ts-expect-error
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import cors from 'cors'
import chalk from 'chalk'

import { resolvers, typeDefs } from './graphql/index.js'

async function serve() {
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

  console.log(chalk.green('~~~'), '🚀 Ecu server ready at http://localhost:4000/')
}

export default serve
