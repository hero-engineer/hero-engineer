import { gql } from 'apollo-server'

import getComponent from './queries/getComponent'
import getComponents from './queries/getComponents'
import createComponent from './mutations/createComponent'
import addComponent from './mutations/addComponent'

export const typeDefs = gql`
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
    children
  }

  type Query {
    component(id: String!): Component
    components: [Component]
  }

  type Mutation {
    createComponent(name: String!): Component
    addComponent(componentId: String!, hierarchyIds: [String!]!, hierarchyPosition: ComponentHierarchyPosition!): File
  }
`

export const resolvers = {
  Query: {
    component: getComponent,
    components: getComponents,
  },
  Mutation: {
    createComponent,
    addComponent,
  },
}
