import { gql } from 'apollo-server'

import componentQuery from './queries/componentQuery'
import componentsQuery from './queries/componentsQuery'
import hierarchyQuery from './queries/hierarchyQuery'
import globalTypesQuery from './queries/globalTypesQuery'
import fileImportsQuery from './queries/fileImportsQuery'
import fileTypesQuery from './queries/fileTypesQuery'
import createComponentMutation from './mutations/createComponentMutation'
import addComponentMutation from './mutations/addComponentMutation'
import deleteComponentMutation from './mutations/deleteComponentMutation'
import moveComponentMutation from './mutations/moveComponentMutation'
import writeGlobalTypesMutation from './mutations/writeGlobalTypesMutation'
import writeFileImportsMutation from './mutations/writeFileImportsMutation'
import writeFileTypesMutation from './mutations/writeFileTypesMutation'
import removeFileUnusedImportsMutation from './mutations/removeFileUnusedImportsMutation'

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

  type ComponentAndFile {
    component: FunctionNode!
    file: FileNode!
  }

  type GlobalTypesReturnValue {
    globalTypesFileContent: String!
  }

  type Import {
    name: String!
    value: String!
  }

  type Type {
    name: String!
    declaration: String!
    fileNodeAddress: String!
  }

  type FileImportsReturnValue {
    rawImports: String!
    imports: [Import]!
  }

  type FileTypesReturnValue {
    rawTypes: String!
    types: [Type]!
  }

  type Query {
    component(sourceComponentAddress: String!): ComponentAndFile!
    components: [ComponentAndFile]!
    hierarchy(sourceComponentAddress: String!): String!
    globalTypes: GlobalTypesReturnValue!
    fileImports(sourceFileAddress: String!): FileImportsReturnValue!
    fileTypes(sourceFileAddress: String!): FileTypesReturnValue!
  }

  type Mutation {
    createComponent(name: String!): FunctionNode!
    addComponent(sourceComponentAddress: String!, targetComponentAddress: String!, hierarchyIds: [String!]!, hierarchyPosition: HierarchyPosition!, componentDelta: Int!): FunctionNode!
    deleteComponent(sourceComponentAddress: String!, hierarchyIds: [String!]!, componentDelta: Int!): FunctionNode!
    moveComponent(sourceComponentAddress: String!, sourceHierarchyIds: [String!]!, targetHierarchyIds: [String!]!, hierarchyPosition: HierarchyPosition!): [FunctionNode!]!
    writeGlobalTypes(globalTypesFileContent: String!): Boolean!
    writeFileImports(sourceFileAddress: String!, rawImports: String!): Boolean!
    writeFileTypes(sourceFileAddress: String!, rawTypes: String!): Boolean!
    removeFileUnusedImports(sourceFileAddress: String!): Boolean!
  }

`

export const resolvers = {
  Query: {
    component: componentQuery,
    components: componentsQuery,
    hierarchy: hierarchyQuery,
    globalTypes: globalTypesQuery,
    fileImports: fileImportsQuery,
    fileTypes: fileTypesQuery,
  },
  Mutation: {
    createComponent: createComponentMutation,
    addComponent: addComponentMutation,
    deleteComponent: deleteComponentMutation,
    moveComponent: moveComponentMutation,
    writeGlobalTypes: writeGlobalTypesMutation,
    writeFileImports: writeFileImportsMutation,
    writeFileTypes: writeFileTypesMutation,
    removeFileUnusedImports: removeFileUnusedImportsMutation,
  },
}
