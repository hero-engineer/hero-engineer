import { gql } from 'apollo-server'

import getComponent from './queries/getComponent'
import getComponents from './queries/getComponents'
import getHierarchy from './queries/getHierarchy'
import createComponent from './mutations/createComponent'
import addComponent from './mutations/addComponent'
import deleteComponent from './mutations/deleteComponent'
import moveComponent from './mutations/moveComponent'

export const typeDefs = gql`

  enum ExportType {
    default
    named
    none
  }

  enum HierarchyPosition {
    before
    after
    within
    children
    parent
  }

  type FileNodePayload {
    name: String!
    extension: String!
    path: String!
    relativePath: String!
    text: String!
  }

  type FileNode {
    address: String!
    role: String!
    payload: FileNodePayload
  }

  type FunctionNodePayload {
    name: String!
    path: String!
    relativePath: String!
    exportType: ExportType!
    isComponent: Boolean!
  }

  type FunctionNode {
    address: String!
    role: String!
    payload: FunctionNodePayload
  }

  type HierarchyItem {
    label: String!
    hierarchyId: String
    componentId: String
  }

  type Query {
    component(id: String!): FunctionNode
    components: [FunctionNode]
    hierarchy(sourceComponentId: String!, hierarchyIds: [String!]!): [HierarchyItem]
  }

  type Mutation {
    createComponent(name: String!): FunctionNode
    addComponent(sourceComponentId: String!, targetComponentId: String!, hierarchyIds: [String!]!, hierarchyPosition: HierarchyPosition!): FunctionNode
    deleteComponent(sourceComponentId: String!, hierarchyIds: [String!]!): FunctionNode
    moveComponent(sourceComponentId: String!, sourceHierarchyIds: [String!]!, ttargetHierarchyIds: [String!]!, hierarchyPosition: HierarchyPosition!): [FunctionNode]
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
    moveComponent,
  },
}
