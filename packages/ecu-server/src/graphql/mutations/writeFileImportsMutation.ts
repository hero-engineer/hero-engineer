import { importsEndComment, importsStartComment } from '../../configuration'
import { FileNodeType, HistoryMutationReturnType } from '../../types'

import { getNodeByAddress } from '../../graph'

import composeHistoryMutation from '../../history/composeHistoryMutation'

import insertBetweenComments from '../../domain/comments/insertBetweenComments'
import regenerate from '../../domain/regenerate'

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
