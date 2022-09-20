import { ApolloServer, gql } from 'apollo-server'

// import getScenes from './queries/getScenes'
import getComponents from './queries/getComponents'
// import createComponent from './mutations/createComponent'
// import addComponent from './mutations/addComponent'
// import removeComponent from './mutations/removeComponent'
// import dragComponent from './mutations/dragComponent'
// import createScene from './mutations/createScene'
import graph from './graph'
import buildGraph from './graph/build'

buildGraph(graph)

const typeDefs = gql`
  type Component {
    id: ID!
    name: String!
  }

  type Query {
    components: [Component]
  }

  # type Mutation {
    # createComponent(name: String!): Component
    # addComponent(name: String!, index: String!, position: String!): Component
    # removeComponent(index: String!): Component
    # dragComponent(name: String!, sourceIndex: String!, targetIndex: String!, position: String!): Component
  # }
`

const resolvers = {
  Query: {
    // scenes: getScenes,
    components: getComponents,
  },
  // Mutation: {
    // createComponent,
    // addComponent,
    // removeComponent,
    // dragComponent,
  // },
}

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
