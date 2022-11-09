import { typesEndComment, typesStartComment } from '../../configuration'
import { FileNodeType, FunctionNodeType, HistoryMutationReturnType } from '../../types'

import { getNodeByAddress, getNodesBySecondNeighbourg } from '../../graph'

import composeHistoryMutation from '../../history/composeHistoryMutation'

import getTypesImports from '../../domain/types/getTypesImports'
import getAllFileImports from '../../domain/imports/getAllFileImports'
import insertBetweenComments from '../../domain/comments/insertBetweenComments'
import insertFirstLine from '../../domain/code/insertFirstLine'
import regenerate from '../../domain/regenerate'

type WriteComponentTypesMutationArgs = {
  sourceComponentAddress: string
  rawTypes: string
}

async function writeComponentTypesMutation(_: any, { sourceComponentAddress, rawTypes }: WriteComponentTypesMutationArgs): Promise<HistoryMutationReturnType<boolean>> {
  console.log('___writeComponentTypesMutation___')

  const componentNode = getNodeByAddress<FunctionNodeType>(sourceComponentAddress)

  if (!componentNode) {
    throw new Error(`Component with id ${sourceComponentAddress} not found`)
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentNode.address, 'DeclaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for component ${sourceComponentAddress} not found`)
  }

  const typeImports = getTypesImports(rawTypes)
  const fileImports = getAllFileImports(fileNode)
  // addImportsToFile(fileNode, typeImports)
  console.log('typeImports', typeImports)
  console.log('fileImports', fileImports)

  let code = insertBetweenComments(fileNode, typesStartComment, typesEndComment, rawTypes)

  if (!code) {
    throw new Error(`Types start or end comment not found for component ${sourceComponentAddress}`)
  }

  for (const typeImport of typeImports) {
    if (!fileImports.some(fileImport => fileImport.name === typeImport.name && fileImport.value === typeImport.value)) {
      code = insertFirstLine(code, `import {${typeImport.name}} from '${typeImport.value}'`)
    }
  }

  await regenerate(fileNode, code)

  return {
    returnValue: true,
    impactedFileNodes: [fileNode],
    description: `Write types for component ${componentNode.payload.name}`,
  }
}

export default composeHistoryMutation(writeComponentTypesMutation)
