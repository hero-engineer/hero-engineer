import { gql } from 'apollo-server'

import getComponent from './queries/getComponent'
import getComponents from './queries/getComponents'
import getHierarchy from './queries/getHierarchy'
import isHierarchyOnComponent from './queries/isHierarchyOnComponent'
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
    componentName: String!
    componentAddress: String
    hierarchyId: String
  }


  type HierarchyReturnValue {
    hierarchy: [HierarchyItem]!
    componentRootHierarchyIds: [String]!
  }

  type Query {
    component(id: String!): FunctionNode
    components: [FunctionNode]
    hierarchy(sourceComponentAddress: String!, hierarchyIds: [String!]!): HierarchyReturnValue
    isHierarchyOnComponent(sourceComponentAddress: String!, hierarchyIds: [String!]!, componentDelta: Int!): Boolean
  }

  type Mutation {
    createComponent(name: String!): FunctionNode
    addComponent(sourceComponentAddress: String!, targetComponentAddress: String!, hierarchyIds: [String!]!, hierarchyPosition: HierarchyPosition!): FunctionNode
    deleteComponent(sourceComponentAddress: String!, hierarchyIds: [String!]!, componentDelta: Int!): FunctionNode
    moveComponent(sourceComponentAddress: String!, sourceHierarchyIds: [String!]!, targetHierarchyIds: [String!]!, hierarchyPosition: HierarchyPosition!): [FunctionNode]
  }

`

export const resolvers = {
  Query: {
    component: getComponent,
    components: getComponents,
    hierarchy: getHierarchy,
    isHierarchyOnComponent,
  },
  Mutation: {
    createComponent,
    addComponent,
    deleteComponent,
    moveComponent,
  },
}
