import { ApolloServer } from 'apollo-server'
import express from 'express'

import { resolvers, typeDefs } from './graphql/index.js'

import buildGraph from './graph/build/index.js'

import getEcuLocation from './helpers/getEcuLocation.js'

async function serve() {
  await buildGraph()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cors: {
      origin: '*',
    },
  })

  server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀 Ecu GraphQL server ready at ${url}`)
  })

  const app = express()

  app.use(express.static(getEcuLocation()))

  app.listen(4001)

  console.log('🚀 Ecu static server ready at http://localhost:4001/')
}

export default serve
