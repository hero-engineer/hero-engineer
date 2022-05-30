import { ApolloServer, gql } from 'apollo-server'

import getComponents from './queries/getComponents'
import createComponent from './mutations/createComponent'
import addComponent from './mutations/addComponent'

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
    addComponent(name: String!): Component
  }
`

const resolvers = {
  Query: {
    components: getComponents,
  },
  Mutation: {
    createComponent,
    addComponent,
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
