import { BreakpointType, ColorType, CssClassType, FileNodeType, FileType, FontType, FunctionNodeType, ImportType, PackageType, SpacingType, TypeType } from '@types'

type ComponentReturnType = {
  component: FunctionNodeType
  file: FileNodeType
  decoratorPaths: string[]
  isComponentAcceptingChildren: boolean
  screenshotUrl: string
}

/* --
  * QUERIES
-- */

export const ComponentsQuery = `
  query {
    components {
      file {
        address
        payload {
          name
          path
          relativePath
          emoji
          description
        }
      }
      component {
        address
        payload {
          name
          path
          relativePath
        }
      }
      isComponentAcceptingChildren
      screenshotUrl
    }
  }
`

export type ComponentsQueryDataType = {
  components: ComponentReturnType[]
}

export const ComponentQuery = `
  query ($sourceComponentAddress: String!){
    component (sourceComponentAddress: $sourceComponentAddress) {
      file {
        address
        payload {
          name
          path
          relativePath
          emoji
          description
        }
      }
      component {
        address
        payload {
          name
          path
          relativePath
        }
      }
      decoratorPaths
    }
  }
`

export type ComponentQueryDataType = {
  component: ComponentReturnType
}

export const HierarchyQuery = `
  query ($sourceComponentAddress: String!) {
    hierarchy (sourceComponentAddress: $sourceComponentAddress)
  }
`

export type HierarchyQueryDataType = {
  hierarchy: string
}

export const IsCssValidQuery = `
  query ($css: String!){
    isCssValid (css: $css) {
      isCssValid
      css
    }
  }
`

export type IsCssValidQueryDataType = {
  isCssValid: {
    isCssValid: boolean
    css: string
  }
}

export const BreakpointsQuery = `
  query {
    breakpoints {
      id
      name
      min
      max
      base
      scale
      media
    }
  }
`

export type BreakpointsQueryDataType = {
  breakpoints: BreakpointType[]
}

export const FontsQuery = `
  query {
    fonts {
      id
      name
      weights
      isVariable
      url
    }
  }
`

export type FontsQueryDataType = {
  fonts: FontType[]
}

export const ColorsQuery = `
  query {
    colors {
      id
      name
      value
      variableName
    }
  }
`

export type ColorsQueryDataType = {
  colors: ColorType[]
}

export const SpacingsQuery = `
  query {
    spacings {
      id
      name
      value
      variableName
    }
  }
`

export type SpacingsQueryDataType = {
  spacings: SpacingType[]
}

export const RootCssQuery = `
  query {
    rootCss
  }
`

export type RootCssQueryDataType = {
  rootCss: string
}

export const CssClassesQuery = `
  query {
    cssClasses {
      selector
      declaration
      media
      attributes {
        name
        value
      }
    }
  }
`

export type CssClassesQueryDataType = {
  cssClasses: CssClassType[]
}

export const GlobalTypesQuery = `
  query {
    globalTypes {
      globalTypesFileContent
    }
  }
`

export type GlobalTypesQueryDataType = {
  globalTypes: {
    globalTypesFileContent: string
  }
}

export const FileTypesQuery = `
  query ($sourceFileAddress: String!){
    fileTypes (sourceFileAddress: $sourceFileAddress) {
      rawTypes
      types {
        name
        declaration
        fileNodeAddress
      }
    }
  }
`

export type FileTypesQueryDataType = {
  fileTypes: {
    rawTypes: string
    types: TypeType[]
  }
}

export const FileImportsQuery = `
query ($sourceFileAddress: String!){
  fileImports (sourceFileAddress: $sourceFileAddress) {
    rawImports
    imports {
      name
      source
      type
    }
  }
}
`

export type FileImportsQueryDataType = {
  fileImports: {
    rawImports: string
    imports: ImportType[]
  }
}

export const FaviconQuery = `
  query {
    favicon
  }
`

export type FaviconQueryDataType = {
  favicon: string
}

// Unused
export const IsComponentAcceptingChildrenQuery = `
  query ($sourceComponentAddress: String, $ecuComponentName: String) {
    isComponentAcceptingChildren (sourceComponentAddress: $sourceComponentAddress, ecuComponentName: $ecuComponentName)
  }
`

export type IsComponentAcceptingChildrenQueryDataType = {
  isComponentAcceptingChildren: boolean
}

export const UndoRedoMetadataQuery = `
  query {
    undoRedoMetadata {
      undoMessage
      redoMessage
    }
  }
`

export type UndoRedoMetadastaQueryDataType = {
  undoRedoMetadata: {
    undoMessage: string
    redoMessage: string | null
  }
}

export const PackagesQuery = `
  query {
    packages {
      name
      version
      type
    }
  }
`

export type PackagesQueryDataType = {
  packages: PackageType[]
}

export const PackagesUpdatesQuery = `
  query {
    packagesUpdates {
      name
      version
      type
    }
  }
`

export type PackagesUpdatesQueryDataType = {
  packagesUpdates: PackageType[]
}

/* --
  * MUTATIONS
-- */

export const CreateComponentMutation = `
  mutation ($name: String!) {
    createComponent (name: $name) {
      component {
        address
      }
      file {
        address
      }
    }
  }
`

export type CreateComponentMutationDataType = {
  createComponent: {
    component: FunctionNodeType
    file: FileNodeType
  }
}

export const AddComponentMutation = `
  mutation ($sourceComponentAddress: String!, $targetComponentAddress: String!, $targetHierarchyId: String!, $hierarchyPosition: HierarchyPosition!, $componentDelta: Int!) {
    addComponent (sourceComponentAddress: $sourceComponentAddress, targetComponentAddress: $targetComponentAddress, targetHierarchyId: $targetHierarchyId, hierarchyPosition: $hierarchyPosition, componentDelta: $componentDelta)
  }
`

export type AddComponentMutationDataType = {
  addComponent: boolean
}

export const DeleteComponentMutation = `
  mutation ($sourceComponentAddress: String!, $targetHierarchyId: String!, $componentDelta: Int!) {
    deleteComponent (sourceComponentAddress: $sourceComponentAddress, targetHierarchyId: $targetHierarchyId, componentDelta: $componentDelta)
  }
`

export type DeleteComponentMutationDataType = {
  deleteComponent: boolean
}

export const MoveComponentMutation = `
  mutation ($sourceComponentAddress: String!, $sourceHierarchyId: String!, $targetHierarchyId: String!, $hierarchyPosition: HierarchyPosition!) {
    moveComponent (sourceComponentAddress: $sourceComponentAddress, sourceHierarchyId: $sourceHierarchyId, targetHierarchyId: $targetHierarchyId, hierarchyPosition: $hierarchyPosition)
  }
`

export type MoveComponentMutationDataType = {
  moveComponent: boolean
}

export const UpdateGlobalTypesMutation = `
  mutation ($globalTypesFileContent: String!) {
    updateGlobalTypes (globalTypesFileContent: $globalTypesFileContent)
  }
`

export type UpdateGlobalTypesMutationDataType = {
  updateGlobalTypes: boolean
}

export const UpdateFileTypesMutation = `
  mutation ($sourceFileAddress: String!, $rawTypes: String!) {
    updateFileTypes (sourceFileAddress: $sourceFileAddress, rawTypes: $rawTypes)
  }
`

export type UpdateFileTypesMutationDataType = {
  updateFileTypes: boolean
}

export const UpdateFileImportsMutation = `
  mutation ($sourceFileAddress: String!, $rawImports: String!) {
    updateFileImports (sourceFileAddress: $sourceFileAddress, rawImports: $rawImports)
  }
`

export type UpdateFileImportsMutationDataType = {
  updateFileImports: boolean
}

export const UpdateHierarchyDisplayNameMutation = `
  mutation ($sourceComponentAddress: String!, $targetHierarchyId: String!, $componentDelta: Int! $value: String!) {
    updateHierarchyDisplayName (sourceComponentAddress: $sourceComponentAddress, targetHierarchyId: $targetHierarchyId, componentDelta: $componentDelta, value: $value)
  }
`

export type UpdateHierarchyDisplayNameMutationDataType = {
  updateHierarchyDisplayName: boolean
}

export const UpdateTextValueMutation = `
  mutation ($sourceComponentAddress: String!, $targetHierarchyId: String!, $value: String!) {
    updateTextValue (sourceComponentAddress: $sourceComponentAddress, targetHierarchyId: $targetHierarchyId, value: $value)
  }
`

export type UpdateTextValueMutationDataType = {
  updateTextValue: boolean
}

export const UpdateFileDescriptionMutation = `
  mutation ($sourceFileAddress: String!, $description: String!,  $emoji: String!) {
    updateFileDescription (sourceFileAddress: $sourceFileAddress, description: $description, emoji: $emoji)
  }
`

export type UpdateFileDescriptionMutationDataType = {
  updateFileDescription: boolean
}

export const UpdateFontsMutation = `
  mutation ($fontsJson: String!) {
    updateFonts (fontsJson: $fontsJson)
  }
`

export type UpdateFontsMutationDataType = {
  updateFonts: boolean
}

export const UpdateColorsMutation = `
  mutation ($colorsJson: String!) {
    updateColors (colorsJson: $colorsJson)
  }
`

export type UpdateColorsMutationDataType = {
  updateColors: boolean
}

export const UpdateSpacingsMutation = `
  mutation ($spacingsJson: String!) {
    updateSpacings (spacingsJson: $spacingsJson)
  }
`

export type UpdateSpacingsMutationDataType = {
  updateSpacings: boolean
}

export const UpdateRootCssMutation = `
  mutation ($rootCss: String!) {
    updateRootCss (rootCss: $rootCss)
  }
`

export type UpdateRootCssMutationDataType = {
  updateRootCss: boolean
}

export const CreateCssClassMutation = `
  mutation ($sourceComponentAddress: String!, $targetHierarchyId: String!, $componentDelta: Int! $classNames: [String]!) {
    createCssClass (sourceComponentAddress: $sourceComponentAddress, targetHierarchyId: $targetHierarchyId, componentDelta: $componentDelta, classNames: $classNames)
  }
`

export type CreateCssClassMutationDataType = {
  createCssClass: boolean
}

export const UpdateCssClassMutation = `
  mutation ($classNames: [String!]!, $breakpointId: String!, $attributesJson: String!) {
    updateCssClass (classNames: $classNames, breakpointId: $breakpointId, attributesJson: $attributesJson)
  }
`

export type UpdateCssClassMutationDataType = {
  updateCssClass: boolean
}

export const UploadFileMutation = `
  mutation ($file: Upload!, $fileName: String!) {
    uploadFile (file: $file, fileName: $fileName)
  }
`

export type UploadFileMutationDataType = {
  uploadFile: string
}

export const UpdateFaviconMutation = `
  mutation ($url: String!) {
    updateFavicon (url: $url)
  }
`

export type UpdateFaviconMutationDataType = {
  updateFavicon: boolean
}

export const InstallOrUpdatePackageMutation = `
  mutation ($name: String!, $version: String!, $type: String!, $shouldDelete: Boolean!) {
    installOrUpdatePackage (name: $name, version: $version, type: $type, shouldDelete: $shouldDelete)
  }
`

export type InstallOrUpdatePackageMutationDataType = {
  installOrUpdatePackage: boolean
}

export const UpdateComponentScreenshotMutation = `
  mutation ($sourceComponentAddress: String!, $dataUrl: String!) {
    updateComponentScreenshot (sourceComponentAddress: $sourceComponentAddress, dataUrl: $dataUrl)
  }
`

export type UpdateComponentScreenshotMutationDataType = {
  updateComponentScreenshot: boolean
}

export const UndoMutation = `
  mutation {
    undo
  }
`

export type UndoMutationDataType = {
  undo: boolean
}

export const RedoMutation = `
  mutation {
    redo
  }
`

export type RedoMutationDataType = {
  undo: boolean
}

export const PushMutation = `
  mutation {
    push
  }
`

export type PushMutationDataType = {
  push: boolean
}

/* --
  * full-ast QUERIES
-- */

export const FilesQuery = `
  query {
    files {
      path
      relativePath
      content
    }
  }
`

export type FilesQueryDataType = {
  files: FileType[]
}

/* --
  * full-ast MUTATIONs
-- */
