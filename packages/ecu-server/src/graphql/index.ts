import { gql } from 'apollo-server'
import { GraphQLScalarType, Kind } from 'graphql'

import withLog from './withLog.js'

import componentQuery from './queries/componentQuery.js'
import componentsQuery from './queries/componentsQuery.js'
import hierarchyQuery from './queries/hierarchyQuery.js'
import cssClassesQuery from './queries/cssClassesQuery.js'
import globalTypesQuery from './queries/globalTypesQuery.js'
import fileImportsQuery from './queries/fileImportsQuery.js'
import fileTypesQuery from './queries/fileTypesQuery.js'
import isComponentAcceptingChildrenQuery from './queries/isComponentAcceptingChildrenQuery.js'
import breakpointsQuery from './queries/breakpointsQuery.js'
import fontsQuery from './queries/fontsQuery.js'
import packagesQuery from './queries/packagesQuery.js'
import packagesUpdatesQuery from './queries/packagesUpdatesQuery.js'
import undoRedoMetadataQuery from './queries/undoRedoMetdataQuery.js'

import createComponentMutation from './mutations/createComponentMutation.js'
import addComponentMutation from './mutations/addComponentMutation.js'
import deleteComponentMutation from './mutations/deleteComponentMutation.js'
import moveComponentMutation from './mutations/moveComponentMutation.js'
import updateHierarchyDisplayNameMutation from './mutations/updateHierarchyDisplayNameMutation.js'
import updateTextValueMutation from './mutations/updateTextValueMutation.js'
import updateFileDescriptionMutation from './mutations/updateFileDescriptionMutation.js'
import updateFileImportsMutation from './mutations/updateFileImportsMutation.js'
import updateFileTypesMutation from './mutations/updateFileTypesMutation.js'
import removeFileUnusedImportsMutation from './mutations/removeFileUnusedImportsMutation.js'
import updateGlobalTypesMutation from './mutations/updateGlobalTypesMutation.js'
import updateComponentScreenshotMutation from './mutations/updateComponentScreenshotMutation.js'
import updateFontsMutation from './mutations/updateFontsMutation.js'
import createCssClassMutation from './mutations/createCssClassMutation.js'
import updateCssClassMutation from './mutations/updateCssClassMutation.js'
import installOrUpdatePackageMutation from './mutations/installOrUpdatePackageMutation.js'
import undoMutation from './mutations/undoMutation.js'
import redoMutation from './mutations/redoMutation.js'
import pushMutation from './mutations/pushMutation.js'

export const typeDefs = gql`

  scalar CssValue

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
    description: String!
    emoji: String!
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
    decoratorPaths: [String]!
    isComponentAcceptingChildren: Boolean!
    screenshotUrl: String!
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

  type Package {
    name: String!
    version: String!
    type: String!
  }

  type Breakpoint {
    id: String!
    name: String!
    min: Int!
    max: Int!
    base: Int!
    scale: Float!
    media: String!
  }

  type Font {
    id: String!
    name: String!
    isVariable: Boolean!
    weights: [Int!]!
    url: String!
  }

  type CssAttribute {
    name: String!
    value: CssValue!
  }

  type CssClass {
    id: String!
    selector: String!
    media: String!
    declaration: String!
    attributes: [CssAttribute]!
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

  type UndoRedoMetadataReturnValue {
    undoMessage: String!
    redoMessage: String
  }

  type Query {
    component(sourceComponentAddress: String!): ComponentReturnValue!
    components: [ComponentReturnValue]!
    hierarchy(sourceComponentAddress: String!): String!
    globalTypes: GlobalTypesReturnValue!
    fileImports(sourceFileAddress: String!): FileImportsReturnValue!
    fileTypes(sourceFileAddress: String!): FileTypesReturnValue!
    isComponentAcceptingChildren(sourceComponentAddress: String, ecuComponentName: String): Boolean!

    breakpoints: [Breakpoint]!
    fonts: [Font]!
    cssClasses: [CssClass]!

    packages: [Package]!
    packagesUpdates: [Package]!

    undoRedoMetadata: UndoRedoMetadataReturnValue!
  }

  type Mutation {
    createComponent(name: String!): CreateComponentReturnValue!
    addComponent(sourceComponentAddress: String!, targetComponentAddress: String!, targetHierarchyId: String!, hierarchyPosition: HierarchyPosition!, componentDelta: Int!): Boolean!
    deleteComponent(sourceComponentAddress: String!, targetHierarchyId: String!, componentDelta: Int!): Boolean!
    moveComponent(sourceComponentAddress: String!, sourceHierarchyId: String!, targetHierarchyId: String!, hierarchyPosition: HierarchyPosition!): Boolean!

    updateHierarchyDisplayName(sourceComponentAddress: String!, targetHierarchyId: String!, componentDelta: Int!, value: String!): Boolean!

    updateTextValue(sourceComponentAddress: String!, targetHierarchyId: String!, value: String!): Boolean!

    updateFileDescription(sourceFileAddress: String!, description: String!, emoji: String!): Boolean!
    updateFileImports(sourceFileAddress: String!, rawImports: String!): Boolean!
    removeFileUnusedImports(sourceFileAddress: String!): Boolean!
    updateGlobalTypes(globalTypesFileContent: String!): Boolean!
    updateFileTypes(sourceFileAddress: String!, rawTypes: String!): Boolean!

    updateFonts(fontsJson: String!): Boolean!
    createCssClass(sourceComponentAddress: String!, targetHierarchyId: String!, componentDelta: Int!, classNames: [String]!): Boolean!
    updateCssClass(classNames: [String!]!, breakpointId: String!, attributesJson: String!): Boolean!

    installOrUpdatePackage(name: String!, version: String!, type: String!, shouldDelete: Boolean!): Boolean!

    updateComponentScreenshot(sourceComponentAddress: String!, dataUrl: String!): Boolean!

    undo: Boolean!
    redo: Boolean!
    push: Boolean!
  }

`

export const resolvers = {
  Query: {
    component: withLog(componentQuery),
    components: withLog(componentsQuery),
    hierarchy: withLog(hierarchyQuery),
    globalTypes: withLog(globalTypesQuery),
    fileImports: withLog(fileImportsQuery),
    fileTypes: withLog(fileTypesQuery),
    isComponentAcceptingChildren: withLog(isComponentAcceptingChildrenQuery),

    breakpoints: withLog(breakpointsQuery),
    fonts: withLog(fontsQuery),
    cssClasses: withLog(cssClassesQuery),

    packages: withLog(packagesQuery),
    packagesUpdates: withLog(packagesUpdatesQuery),

    undoRedoMetadata: withLog(undoRedoMetadataQuery),
  },
  Mutation: {
    createComponent: withLog(createComponentMutation, true),
    addComponent: withLog(addComponentMutation, true),
    deleteComponent: withLog(deleteComponentMutation, true),
    moveComponent: withLog(moveComponentMutation, true),

    updateHierarchyDisplayName: withLog(updateHierarchyDisplayNameMutation, true),

    updateTextValue: withLog(updateTextValueMutation, true),

    updateFileDescription: withLog(updateFileDescriptionMutation, true),
    updateFileImports: withLog(updateFileImportsMutation, true),
    removeFileUnusedImports: withLog(removeFileUnusedImportsMutation, true),
    updateFileTypes: withLog(updateFileTypesMutation, true),
    updateGlobalTypes: withLog(updateGlobalTypesMutation, true),

    updateFonts: withLog(updateFontsMutation, true),
    createCssClass: withLog(createCssClassMutation, true),
    updateCssClass: withLog(updateCssClassMutation, true),

    installOrUpdatePackage: withLog(installOrUpdatePackageMutation, true),

    updateComponentScreenshot: withLog(updateComponentScreenshotMutation, true),

    undo: withLog(undoMutation, true),
    redo: withLog(redoMutation, true),
    push: withLog(pushMutation, true),
  },
  CssValue: new GraphQLScalarType({
    name: 'CssValue',
    description: 'A string or number representing a CSS value',
    serialize(value) {
      return value
    },
    parseValue(value) {
      return value
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT || ast.kind === Kind.FLOAT || ast.kind === Kind.STRING) {
        return ast.value
      }

      return null
    },
  }),
}
