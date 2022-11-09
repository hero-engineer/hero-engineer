import { FileNodeType, HistoryMutationReturnType } from '../../types'

import { getNodeByAddress } from '../../graph'

import composeHistoryMutation from '../../history/composeHistoryMutation'

import removeUnusedImports from '../../domain/imports/removeUnusedImports'
import regenerate from '../../domain/regenerate'

type RemoveFileUnunsedImportsMutationArgs = {
  sourceFileAddress: string
}

async function removeFileUnunsedImportsMutation(_: any, { sourceFileAddress }: RemoveFileUnunsedImportsMutationArgs): Promise<HistoryMutationReturnType<boolean>> {
  console.log('___removeFileUnunsedImportsMutation___')

  const fileNode = getNodeByAddress<FileNodeType>(sourceFileAddress)

  if (!fileNode) {
    throw new Error(`File ${sourceFileAddress} not found`)
  }

  const { ast } = fileNode.payload

  removeUnusedImports(ast)

  await regenerate(fileNode, ast)

  return {
    returnValue: true,
    impactedFileNodes: [fileNode],
    description: `Remove  unused imports for file ${fileNode.payload.name}`,
  }
}

export default composeHistoryMutation(removeFileUnunsedImportsMutation)
