import { typesEndComment, typesStartComment } from '../../configuration'
import { FileNodeType, FunctionNodeType, HistoryMutationReturnType } from '../../types'

import { getNodeByAddress, getNodesBySecondNeighbourg } from '../../graph'

import composeHistoryMutation from '../../history/composeHistoryMutation'

import getTypesImports from '../../domain/types/getTypesImports'
import traverseImports from '../../domain/imports/traverseImports'
import insertBetweenComments from '../../domain/comments/insertBetweenComments'
import insertFirstLine from '../../domain/code/insertFirstLine'
import regenerate from '../../domain/regenerate'

type WriteFileImportsMutationArgs = {
  sourceFileAddress: string
  rawTypes: string
}

async function writeFileImportsMutation(_: any, { sourceFileAddress, rawTypes }: WriteFileImportsMutationArgs): Promise<HistoryMutationReturnType<boolean>> {
  console.log('___writeFileImportsMutation___')

  const fileNode = getNodeByAddress<FileNodeType>('sourceFileAddress')

  if (!fileNode) {
    throw new Error(`File ${sourceFileAddress} not found`)
  }

  // let code = insertBetweenComments(fileNode, typesStartComment, typesEndComment, rawTypes)

  // if (!code) {
  //   throw new Error(`Types start or end comment not found for component ${sourceFileAddress}`)
  // }

  // const typeImports = getTypesImports(rawTypes)
  // const fileImports = getAllFileImports(fileNode)

  // for (const typeImport of typeImports) {
  //   if (!fileImports.some(fileImport => fileImport.name === typeImport.name && fileImport.value === typeImport.value)) {
  //     code = insertFirstLine(code, `import { ${typeImport.name} } from '${typeImport.value}'`)
  //   }
  // }

  // await regenerate(fileNode, code)

  return {
    returnValue: true,
    impactedFileNodes: [fileNode],
    description: `Write types for file ${fileNode.payload.name}`,
  }
}

export default composeHistoryMutation(writeFileImportsMutation)
