import { gql } from 'apollo-server'

import getComponent from './queries/getComponent'
import getComponents from './queries/getComponents'
import getHierarchy from './queries/getHierarchy'
import createComponent from './mutations/createComponent'
import addComponent from './mutations/addComponent'
import deleteComponent from './mutations/deleteComponent'

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
    parent
  }

  type HierarchyItem {
    label: String
    hierarchyId: String
    componentId: String
  }

  type Query {
    component(id: String!): Component
    components: [Component]
    hierarchy(sourceComponentId: String!, hierarchyIds: [String!]!): [HierarchyItem]
  }

  type Mutation {
    createComponent(name: String!): Component
    addComponent(sourceComponentId: String!, targetComponentId: String!, hierarchyIds: [String!]!, hierarchyPosition: ComponentHierarchyPosition!): File
    deleteComponent(sourceComponentId: String!, hierarchyIds: [String!]!): File
  }
`

export const resolvers = {
  Query: {
    component: getComponent,
    components: getComponents,
    hierarchy: getHierarchy,
  },
  Mutation: {
    createComponent,
    addComponent,
    deleteComponent,
  },
}
