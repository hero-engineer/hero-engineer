import { ApolloServer } from 'apollo-server'

import { resolvers, typeDefs } from './graphql'

import buildGraph from './graph/build'

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

  server.listen().then(({ url }) => {
    console.log(`🚀  Ecu server ready at ${url}`)
  })
}

export default serve
