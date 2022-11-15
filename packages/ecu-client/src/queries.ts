import { ImportType, TypeType } from './types'

type FunctionNodeType = {
  address: string
  payload: {
    name: string
    path: string
    relativePath: string
  }
}

type FileNodeType = {
  address: string
}

type ComponentReturnType = {
  component: FunctionNodeType
  file: FileNodeType
  isComponentAcceptingChildren: boolean
}

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

export const CreateComponentMutation = `
  mutation ($name: String!) {
    createComponent (name: $name) {
      address
    }
  }
`

export type CreateComponentMutationDataType = {
  createComponent: FileNodeType
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

export const WriteGlobalTypesMutation = `
  mutation ($globalTypesFileContent: String!) {
    writeGlobalTypes (globalTypesFileContent: $globalTypesFileContent)
  }
`

export type WriteGlobalTypesMutationDataType = {
  writeGlobalTypes: boolean
}

export const WriteFileTypesMutation = `
  mutation ($sourceFileAddress: String!, $rawTypes: String!) {
    writeFileTypes (sourceFileAddress: $sourceFileAddress, rawTypes: $rawTypes)
  }
`

export type WriteFileTypesMutationDataType = {
  writeFileTypes: boolean
}

export const WriteFileImportsMutation = `
  mutation ($sourceFileAddress: String!, $rawImports: String!) {
    writeFileImports (sourceFileAddress: $sourceFileAddress, rawImports: $rawImports)
  }
`

export type WriteFileImportsMutationDataType = {
  writeFileImports: boolean
}
