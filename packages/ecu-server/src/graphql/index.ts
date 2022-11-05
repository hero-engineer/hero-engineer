import { gql } from 'apollo-server'

import componentQuery from './queries/componentQuery'
import componentsQuery from './queries/componentsQuery'
import hierarchyQuery from './queries/hierarchyQuery'
import isHierarchyOnComponentQuery from './queries/isHierarchyOnComponentQuery'
import createComponentMutation from './mutations/createComponentMutation'
import addComponentMutation from './mutations/addComponentMutation'
import deleteComponentMutation from './mutations/deleteComponentMutation'
import moveComponentMutation from './mutations/moveComponentMutation'

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
    component: componentQuery,
    components: componentsQuery,
    hierarchy: hierarchyQuery,
    isHierarchyOnComponent: isHierarchyOnComponentQuery,
  },
  Mutation: {
    createComponent: createComponentMutation,
    addComponent: addComponentMutation,
    deleteComponent: deleteComponentMutation,
    moveComponent: moveComponentMutation,
  },
}
