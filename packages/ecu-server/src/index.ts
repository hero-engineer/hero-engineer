import { ApolloServer, gql } from 'apollo-server'

import getComponent from './queries/getComponent'
import getComponents from './queries/getComponents'
import createComponent from './mutations/createComponent'
import addComponent from './mutations/addComponent'

import graph from './graph'
import buildGraph from './graph/build'

async function main() {
  await buildGraph(graph)

  const typeDefs = gql`
    type File {
      id: String!
      path: String!
      relativePath: String!
    }

    type Component {
      id: String!
      name: String!
      file: File!
    }

    enum ComponentHierarchyPosition {
      before
      after
      within
    }

    type Query {
      component(id: String!): Component
      components: [Component]
    }

    type Mutation {
      createComponent(name: String!): Component
      addComponent(componentId: String!, hierarchyIds: [String!]!, hierarchyPosition: ComponentHierarchyPosition!): File
      # addComponent(name: String!, index: String!, position: String!): Component
      # removeComponent(index: String!): Component
      # dragComponent(name: String!, sourceIndex: String!, targetIndex: String!, position: String!): Component
    }
  `

  const resolvers = {
    Query: {
      // scenes: getScenes,
      component: getComponent,
      components: getComponents,
    },
    Mutation: {
      createComponent,
      addComponent,
      // removeComponent,
      // dragComponent,
    },
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
}

main()
