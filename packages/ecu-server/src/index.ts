import { ApolloServer } from 'apollo-server'

import { resolvers, typeDefs } from './graphql'

import graph from './graph'
import buildGraph from './graph/build'

async function main() {
  await buildGraph(graph)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cors: {
      origin: '*',
    },
  })

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

main()
