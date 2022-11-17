import { gql } from 'apollo-server'

import componentQuery from './queries/componentQuery.js'
import componentsQuery from './queries/componentsQuery.js'
import hierarchyQuery from './queries/hierarchyQuery.js'
import globalTypesQuery from './queries/globalTypesQuery.js'
import fileImportsQuery from './queries/fileImportsQuery.js'
import fileTypesQuery from './queries/fileTypesQuery.js'
import isComponentAcceptingChildrenQuery from './queries/isComponentAcceptingChildrenQuery.js'
import canRedoQuery from './queries/canRedoQuery.js'
import createComponentMutation from './mutations/createComponentMutation.js'
import addComponentMutation from './mutations/addComponentMutation.js'
import deleteComponentMutation from './mutations/deleteComponentMutation.js'
import moveComponentMutation from './mutations/moveComponentMutation.js'
import updateTextValueMutation from './mutations/updateTextValueMutation.js'
import writeGlobalTypesMutation from './mutations/writeGlobalTypesMutation.js'
import writeFileImportsMutation from './mutations/writeFileImportsMutation.js'
import writeFileTypesMutation from './mutations/writeFileTypesMutation.js'
import removeFileUnusedImportsMutation from './mutations/removeFileUnusedImportsMutation.js'
import updateComponentScreenshotMutation from './mutations/updateComponentScreenshotMutation.js'
import undoMutation from './mutations/undoMutation.js'
import redoMutation from './mutations/redoMutation.js'
import pushMutation from './mutations/pushMutation.js'

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

  type ComponentReturnValue {
    component: FunctionNode!
    file: FileNode!
    isComponentAcceptingChildren: Boolean!
  }

  type GlobalTypesReturnValue {
    globalTypesFileContent: String!
  }

  type Import {
    name: String!
    source: String!
    type: String!
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

  type CreateComponentReturnValue {
    component: FunctionNode!
    file: FileNode!
  }

  type Query {
    component(sourceComponentAddress: String!): ComponentReturnValue!
    components: [ComponentReturnValue]!
    hierarchy(sourceComponentAddress: String!): String!
    globalTypes: GlobalTypesReturnValue!
    fileImports(sourceFileAddress: String!): FileImportsReturnValue!
    fileTypes(sourceFileAddress: String!): FileTypesReturnValue!
    isComponentAcceptingChildren(sourceComponentAddress: String, ecuComponentName: String): Boolean!

    canRedo: Boolean!
  }

  type Mutation {
    createComponent(name: String!): CreateComponentReturnValue!
    addComponent(sourceComponentAddress: String!, targetComponentAddress: String!, targetHierarchyId: String!, hierarchyPosition: HierarchyPosition!, componentDelta: Int!): FunctionNode!
    deleteComponent(sourceComponentAddress: String!, targetHierarchyId: String!, componentDelta: Int!): FunctionNode!
    moveComponent(sourceComponentAddress: String!, sourceHierarchyId: String!, targetHierarchyId: String!, hierarchyPosition: HierarchyPosition!): [FunctionNode!]!

    updateTextValue(sourceComponentAddress: String!, targetHierarchyId: String!, value: String!): Boolean!

    writeFileImports(sourceFileAddress: String!, rawImports: String!): Boolean!
    removeFileUnusedImports(sourceFileAddress: String!): Boolean!
    writeGlobalTypes(globalTypesFileContent: String!): Boolean!
    writeFileTypes(sourceFileAddress: String!, rawTypes: String!): Boolean!

    updateComponentScreenshot(sourceComponentAddress: String!, dataUrl: String!): Boolean!

    undo: Boolean!
    redo: Boolean!
    push: Boolean!
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
    isComponentAcceptingChildren: isComponentAcceptingChildrenQuery,
    canRedo: canRedoQuery,
  },
  Mutation: {
    createComponent: createComponentMutation,
    addComponent: addComponentMutation,
    deleteComponent: deleteComponentMutation,
    moveComponent: moveComponentMutation,

    updateTextValue: updateTextValueMutation,

    writeFileImports: writeFileImportsMutation,
    removeFileUnusedImports: removeFileUnusedImportsMutation,
    writeFileTypes: writeFileTypesMutation,
    writeGlobalTypes: writeGlobalTypesMutation,

    updateComponentScreenshot: updateComponentScreenshotMutation,

    undo: undoMutation,
    redo: redoMutation,
    push: pushMutation,
  },
}
