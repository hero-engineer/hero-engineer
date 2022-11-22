import { importsEndComment, importsStartComment } from '../../configuration.js'
import { FileNodeType, HistoryMutationReturnType } from '../../types.js'

import { getNodeByAddress } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import insertBetweenComments from '../../domain/comments/insertBetweenComments.js'
import regenerate from '../../domain/regenerate.js'

type UpdateFileImportsMutationArgsType = {
  sourceFileAddress: string
  rawImports: string
}

async function updateFileImportsMutation(_: any, { sourceFileAddress, rawImports }: UpdateFileImportsMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  console.log('__updateFileImportsMutation__')

  const fileNode = getNodeByAddress<FileNodeType>(sourceFileAddress)

  if (!fileNode) {
    throw new Error(`File ${sourceFileAddress} not found`)
  }

  let { code } = fileNode.payload

  code = insertBetweenComments(code, importsStartComment, importsEndComment, rawImports)

  if (!code) {
    throw new Error(`Imports start or end comment not found for component ${sourceFileAddress}`)
  }

  await regenerate(fileNode, code)

  return {
    returnValue: true,
    description: `Update imports for file ${fileNode.payload.name}`,
  }
}

export default composeHistoryMutation(updateFileImportsMutation)
