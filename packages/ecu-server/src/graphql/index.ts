import { gql } from 'apollo-server'

import componentQuery from './queries/componentQuery'
import componentsQuery from './queries/componentsQuery'
import hierarchyQuery from './queries/hierarchyQuery'
import hierarchyMetadataQuery from './queries/hierarchyMetadataQuery'
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

  type HierarchyMetadataReturnValue {
    isHierarchyOnComponent: Boolean!
    componentRootHierarchyIds: [String]!
  }

  type Query {
    component(id: String!): FunctionNode
    components: [FunctionNode]
    hierarchy(sourceComponentAddress: String!, hierarchyIds: [String!]!): [HierarchyItem]!
    hierarchyMetadata(sourceComponentAddress: String!, hierarchyIds: [String!]!, componentDelta: Int!): HierarchyMetadataReturnValue
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
    hierarchyMetadata: hierarchyMetadataQuery,
  },
  Mutation: {
    createComponent: createComponentMutation,
    addComponent: addComponentMutation,
    deleteComponent: deleteComponentMutation,
    moveComponent: moveComponentMutation,
  },
}
