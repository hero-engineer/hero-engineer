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
import isCssValidQuery from './queries/isCssValidQuery.js'
import breakpointsQuery from './queries/breakpointsQuery.js'
import fontsQuery from './queries/fontsQuery.js'
import colorsQuery from './queries/colorsQuery.js'
import spacingsQuery from './queries/spacingsQuery.js'
import rootCssQuery from './queries/rootCssQuery.js'
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
import updateColorsMutation from './mutations/updateColorsMutation.js'
import updateSpacingsMutation from './mutations/updateSpacingsMutation.js'
import updateRootCssMutation from './mutations/updateRootCssMutation.js'
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

  type Color {
    id: String!
    name: String!
    value: String!
    variableName: String!
  }

  type Spacing {
    id: String!
    name: String!
    value: String!
    variableName: String!
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

  type IsCssValidReturnValue {
    isCssValid: Boolean!
    css: String!
  }

  type Query {
    component(sourceComponentAddress: String!): ComponentReturnValue!
    components: [ComponentReturnValue]!
    hierarchy(sourceComponentAddress: String!): String!
    globalTypes: GlobalTypesReturnValue!
    fileImports(sourceFileAddress: String!): FileImportsReturnValue!
    fileTypes(sourceFileAddress: String!): FileTypesReturnValue!
    isComponentAcceptingChildren(sourceComponentAddress: String, ecuComponentName: String): Boolean!

    isCssValid(css: String!): IsCssValidReturnValue!
    breakpoints: [Breakpoint]!
    fonts: [Font]!
    colors: [Color]!
    spacings: [Spacing]!
    rootCss: String!
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
    updateColors(colorsJson: String!): Boolean!
    updateSpacings(spacingsJson: String!): Boolean!
    updateRootCss(rootCss: String!): Boolean!
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
    component: withLog(componentQuery, 'component'),
    components: withLog(componentsQuery, 'components'),
    hierarchy: withLog(hierarchyQuery, 'hierarchy'),
    globalTypes: withLog(globalTypesQuery, 'globalTypes'),
    fileImports: withLog(fileImportsQuery, 'fileImports'),
    fileTypes: withLog(fileTypesQuery, 'fileTypes'),
    isComponentAcceptingChildren: withLog(isComponentAcceptingChildrenQuery, 'isComponentAcceptingChildren'),

    isCssValid: withLog(isCssValidQuery, 'isCssValid'),
    breakpoints: withLog(breakpointsQuery, 'breakpoints'),
    fonts: withLog(fontsQuery, 'fonts'),
    colors: withLog(colorsQuery, 'colors'),
    spacings: withLog(spacingsQuery, 'spacings'),
    rootCss: withLog(rootCssQuery, 'rootCss'),
    cssClasses: withLog(cssClassesQuery, 'cssClasses'),

    packages: withLog(packagesQuery, 'packages'),
    packagesUpdates: withLog(packagesUpdatesQuery, 'packagesUpdates'),

    undoRedoMetadata: withLog(undoRedoMetadataQuery, 'undoRedoMetadata'),
  },
  Mutation: {
    createComponent: withLog(createComponentMutation, 'createComponent', true),
    addComponent: withLog(addComponentMutation, 'addComponent', true),
    deleteComponent: withLog(deleteComponentMutation, 'deleteComponent', true),
    moveComponent: withLog(moveComponentMutation, 'moveComponent', true),

    updateHierarchyDisplayName: withLog(updateHierarchyDisplayNameMutation, 'updateHierarchyDisplayName', true),

    updateTextValue: withLog(updateTextValueMutation, 'updateTextValue', true),

    updateFileDescription: withLog(updateFileDescriptionMutation, 'updateFileDescription', true),
    updateFileImports: withLog(updateFileImportsMutation, 'updateFileImports', true),
    removeFileUnusedImports: withLog(removeFileUnusedImportsMutation, 'removeFileUnusedImports', true),
    updateFileTypes: withLog(updateFileTypesMutation, 'updateFileTypes', true),
    updateGlobalTypes: withLog(updateGlobalTypesMutation, 'updateGlobalTypes', true),

    updateFonts: withLog(updateFontsMutation, 'updateFonts', true),
    updateColors: withLog(updateColorsMutation, 'updateColors', true),
    updateSpacings: withLog(updateSpacingsMutation, 'updateSpacings', true),
    updateRootCss: withLog(updateRootCssMutation, 'updateRootCss', true),
    createCssClass: withLog(createCssClassMutation, 'createCssClass', true),
    updateCssClass: withLog(updateCssClassMutation, 'updateCssClass', true),

    installOrUpdatePackage: withLog(installOrUpdatePackageMutation, 'installOrUpdatePackage', true),

    updateComponentScreenshot: withLog(updateComponentScreenshotMutation, 'updateComponentScreenshot', true),

    undo: withLog(undoMutation, 'undo', true),
    redo: withLog(redoMutation, 'redo', true),
    push: withLog(pushMutation, 'push', true),
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
