import { BreakpointType, FileType, PackageType } from '~types'

/* --
  * QUERIES
-- */

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

export const FaviconQuery = `
  query {
    favicon
  }
`

export type FaviconQueryDataType = {
  favicon: string
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

export const FilesQuery = `
  query {
    files {
      path
      code
    }
  }
`

export type FilesQueryDataType = {
  files: FileType[]
}

export const FilePathsQuery = `
  query {
    filePaths
  }
`

export type FilePathsQueryDataType = {
  filePaths: string[]
}

export const ComponentMetadataQuery = `
  query ($componentPath: String!) {
    componentMetadata(componentPath: $componentPath) {
      decoratorPaths
    }
  }
`

export type ComponentMetadataQueryDataType = {
  componentMetadata: {
    decoratorPaths: string[]
  }
}

/* --
  * MUTATIONS
-- */

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

export const SaveFileMutation = `
  mutation ($filePath: String!, $code: String!, $commitMessage: String!) {
    saveFile (filePath: $filePath, code: $code, commitMessage: $commitMessage)
  }
`

export type SaveFileMutationDataType = {
  saveFile: boolean
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
  redo: boolean
}

export const PushMutation = `
  mutation {
    push
  }
`

export type PushMutationDataType = {
  push: boolean
}
