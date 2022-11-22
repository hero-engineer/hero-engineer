import { FileNodeType, HistoryMutationReturnType } from '../../types.js'

import { getNodeByAddress } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import removeUnusedImports from '../../domain/imports/removeUnusedImports.js'
import regenerate from '../../domain/regenerate.js'

type RemoveFileUnunsedImportsMutationArgsType = {
  sourceFileAddress: string
}

async function removeFileUnunsedImportsMutation(_: any, { sourceFileAddress }: RemoveFileUnunsedImportsMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  console.log('__removeFileUnunsedImportsMutation__')

  const fileNode = getNodeByAddress<FileNodeType>(sourceFileAddress)

  if (!fileNode) {
    throw new Error(`File ${sourceFileAddress} not found`)
  }

  const { ast } = fileNode.payload

  removeUnusedImports(ast)

  await regenerate(fileNode, ast)

  return {
    returnValue: true,
    description: `Remove  unused imports for file ${fileNode.payload.name}`,
  }
}

export default composeHistoryMutation(removeFileUnunsedImportsMutation)
