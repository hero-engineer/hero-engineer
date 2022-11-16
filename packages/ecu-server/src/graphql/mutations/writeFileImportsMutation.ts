import { importsEndComment, importsStartComment } from '../../configuration.js'
import { FileNodeType, HistoryMutationReturnType } from '../../types.js'

import { getNodeByAddress } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import insertBetweenComments from '../../domain/comments/insertBetweenComments.js'
import regenerate from '../../domain/regenerate.js'

type WriteFileImportsMutationArgs = {
  sourceFileAddress: string
  rawImports: string
}

async function writeFileImportsMutation(_: any, { sourceFileAddress, rawImports }: WriteFileImportsMutationArgs): Promise<HistoryMutationReturnType<boolean>> {
  console.log('___writeFileImportsMutation___')

  const fileNode = getNodeByAddress<FileNodeType>(sourceFileAddress)

  if (!fileNode) {
    throw new Error(`File ${sourceFileAddress} not found`)
  }

  const code = insertBetweenComments(fileNode, importsStartComment, importsEndComment, rawImports)

  if (!code) {
    throw new Error(`Imports start or end comment not found for component ${sourceFileAddress}`)
  }

  await regenerate(fileNode, code)

  return {
    returnValue: true,
    description: `Write imports for file ${fileNode.payload.name}`,
  }
}

export default composeHistoryMutation(writeFileImportsMutation)
