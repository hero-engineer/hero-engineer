import { typesEndComment, typesStartComment } from '../../configuration'
import { FileNodeType, HistoryMutationReturnType } from '../../types'

import { getNodeByAddress } from '../../graph'

import composeHistoryMutation from '../../history/composeHistoryMutation'

import getTypesImports from '../../domain/types/getTypesImports'
import insertBetweenComments from '../../domain/comments/insertBetweenComments'
import insertImports from '../../domain/imports/insertImports'
import regenerate from '../../domain/regenerate'
import parseCode from '../../domain/parseCode'

type WriteFileTypesMutationArgs = {
  sourceFileAddress: string
  rawTypes: string
}

async function writeFileTypesMutation(_: any, { sourceFileAddress, rawTypes }: WriteFileTypesMutationArgs): Promise<HistoryMutationReturnType<boolean>> {
  console.log('___writeFileTypesMutation___')

  const fileNode = getNodeByAddress<FileNodeType>(sourceFileAddress)

  if (!fileNode) {
    throw new Error(`File ${sourceFileAddress} not found`)
  }

  const code = insertBetweenComments(fileNode, typesStartComment, typesEndComment, rawTypes)

  if (!code) {
    throw new Error(`Types start or end comment not found for component ${sourceFileAddress}`)
  }

  try {
    const ast = parseCode(code)
    const typeImports = getTypesImports(rawTypes)

    insertImports(ast, typeImports)

    await regenerate(fileNode, ast)
  }
  catch (error) {
    console.log('error', error)
  }

  console.log('success')

  return {
    returnValue: true,
    impactedFileNodes: [fileNode],
    description: `Write types for file ${fileNode.payload.name}`,
  }
}

export default composeHistoryMutation(writeFileTypesMutation)
