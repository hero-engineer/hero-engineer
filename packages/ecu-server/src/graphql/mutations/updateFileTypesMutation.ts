import { typesEndComment, typesStartComment } from '../../configuration.js'
import { FileNodeType, HistoryMutationReturnType } from '../../types.js'

import { getNodeByAddress } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import getTypesImports from '../../domain/types/getTypesImports.js'
import insertBetweenComments from '../../domain/comments/insertBetweenComments.js'
import insertImports from '../../domain/imports/insertImports.js'
import regenerate from '../../domain/regenerate.js'
import parseCode from '../../domain/parseCode.js'

type UpdateFileTypesMutationArgs = {
  sourceFileAddress: string
  rawTypes: string
}

async function updateFileTypesMutation(_: any, { sourceFileAddress, rawTypes }: UpdateFileTypesMutationArgs): Promise<HistoryMutationReturnType<boolean>> {
  console.log('__updateFileTypesMutation__')

  const fileNode = getNodeByAddress<FileNodeType>(sourceFileAddress)

  if (!fileNode) {
    throw new Error(`File ${sourceFileAddress} not found`)
  }

  let { code } = fileNode.payload

  code = insertBetweenComments(code, typesStartComment, typesEndComment, rawTypes)

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
    description: `Update types for file ${fileNode.payload.name}`,
  }
}

export default composeHistoryMutation(updateFileTypesMutation)
