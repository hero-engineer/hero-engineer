import { gql } from 'apollo-server'

import componentQuery from './queries/componentQuery'
import componentsQuery from './queries/componentsQuery'
import hierarchyQuery from './queries/hierarchyQuery'
import globalTypesQuery from './queries/globalTypesQuery'
import createComponentMutation from './mutations/createComponentMutation'
import addComponentMutation from './mutations/addComponentMutation'
import deleteComponentMutation from './mutations/deleteComponentMutation'
import moveComponentMutation from './mutations/moveComponentMutation'

export const typeDefs = gql`

  enum ExportType {
    Default
    Named
    None
  }

  # TODO capitalize
  enum HierarchyPosition {
    before
    after
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

  type GlobalTypesReturnValue {
    globalTypesFileContent: String!
  }

  type Query {
    component(sourceComponentAddress: String!): FunctionNode
    components: [FunctionNode]
    hierarchy(sourceComponentAddress: String!): String!
    globalTypes: GlobalTypesReturnValue!
  }

  type Mutation {
    createComponent(name: String!): FunctionNode
    addComponent(sourceComponentAddress: String!, targetComponentAddress: String!, hierarchyIds: [String!]!, hierarchyPosition: HierarchyPosition!, componentDelta: Int!): FunctionNode
    deleteComponent(sourceComponentAddress: String!, hierarchyIds: [String!]!, componentDelta: Int!): FunctionNode
    moveComponent(sourceComponentAddress: String!, sourceHierarchyIds: [String!]!, targetHierarchyIds: [String!]!, hierarchyPosition: HierarchyPosition!): [FunctionNode]
  }

`

export const resolvers = {
  Query: {
    component: componentQuery,
    components: componentsQuery,
    hierarchy: hierarchyQuery,
    globalTypes: globalTypesQuery,
  },
  Mutation: {
    createComponent: createComponentMutation,
    addComponent: addComponentMutation,
    deleteComponent: deleteComponentMutation,
    moveComponent: moveComponentMutation,
  },
}
