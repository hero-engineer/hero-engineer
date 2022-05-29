import { ApolloServer, gql } from 'apollo-server'

import createComponent from './mutations/createComponent'
import getComponents from './queries/getComponents'

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
    createComponent(name: String!): Component
  }
`

const resolvers = {
  Query: {
    components: getComponents,
  },
  Mutation: {
    createComponent,
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
