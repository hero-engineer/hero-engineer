import { ApolloServer, gql } from 'apollo-server'

import getComponents from './queries/getComponents'
import createComponent from './mutations/createComponent'
import addComponent from './mutations/addComponent'
import removeComponent from './mutations/removeComponent'
import dragComponent from './mutations/dragComponent'

const typeDefs = gql`
  type Component {
    id: ID!
    name: String!
    content: String!
  }
  type Query {
    components: [Component]
  }
  type Mutation {
    createComponent: Component
    addComponent(name: String!, index: String!, position: String!): Component
    removeComponent(index: String!): Component
    dragComponent(name: String!, sourceIndex: String!, targetIndex: String!, position: String!): Component
  }
`

const resolvers = {
  Query: {
    components: getComponents,
  },
  Mutation: {
    createComponent,
    addComponent,
    removeComponent,
    dragComponent,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
