import { importsEndComment, importsStartComment } from '../../configuration'
import { FileNodeType } from '../../types'

import { getNodeByAddress } from '../../graph'
import traverseImports from '../../domain/imports/traverseImports'
import extractBetweenComments from '../../domain/comments/extractBetweenComments'

type FileImportsQueryArgs = {
  sourceFileAddress: string
}

function fileImportsQuery(_: any, { sourceFileAddress }: FileImportsQueryArgs) {
  console.log('__fileImportsQuery__')

  const fileNode = getNodeByAddress<FileNodeType>(sourceFileAddress)

  if (!fileNode) {
    throw new Error(`File with address ${sourceFileAddress} not found`)
  }

  return {
    imports: traverseImports(fileNode),
    rawImports: extractBetweenComments(fileNode, importsStartComment, importsEndComment),
  }
}

export default fileImportsQuery
