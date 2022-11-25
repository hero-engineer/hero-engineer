import { FileNodeType, FunctionNodeType, ImportType, PackageType, TypeType } from './types'

type ComponentReturnType = {
  component: FunctionNodeType
  file: FileNodeType
  isComponentAcceptingChildren: boolean
}

/* --
  * QUERIES
-- */

export const HierarchyQuery = `
  query ($sourceComponentAddress: String!) {
    hierarchy (sourceComponentAddress: $sourceComponentAddress)
  }
`

export type HierarchyQueryDataType = {
  hierarchy: string
}

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
    }
  }
`

export type ComponentQueryDataType = {
  component: ComponentReturnType
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
    addComponent (sourceComponentAddress: $sourceComponentAddress, targetComponentAddress: $targetComponentAddress, targetHierarchyId: $targetHierarchyId, hierarchyPosition: $hierarchyPosition, componentDelta: $componentDelta) {
      address
    }
  }
`

export type AddComponentMutationDataType = {
  addComponent: FileNodeType
}

export const DeleteComponentMutation = `
  mutation ($sourceComponentAddress: String!, $targetHierarchyId: String!, $componentDelta: Int!) {
    deleteComponent (sourceComponentAddress: $sourceComponentAddress, targetHierarchyId: $targetHierarchyId, componentDelta: $componentDelta) {
      address
    }
  }
`

export type DeleteComponentMutationDataType = {
  deleteComponent: FileNodeType
}

export const MoveComponentMutation = `
  mutation ($sourceComponentAddress: String!, $sourceHierarchyId: String!, $targetHierarchyId: String!, $hierarchyPosition: HierarchyPosition!) {
    moveComponent (sourceComponentAddress: $sourceComponentAddress, sourceHierarchyId: $sourceHierarchyId, targetHierarchyId: $targetHierarchyId, hierarchyPosition: $hierarchyPosition) {
      address
    }
  }
`

export type MoveComponentMutationDataType = {
  moveComponent: FileNodeType
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
