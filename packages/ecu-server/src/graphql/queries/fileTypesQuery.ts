import { typesEndComment, typesStartComment } from '../../configuration'
import { FileNodeType } from '../../types'

import { getNodeByAddress } from '../../graph'
import traverseTypes from '../../domain/types/traverseTypes'
import extractBetweenComments from '../../domain/comments/extractBetweenComments'

type FileTypesQueryArgs = {
  sourceFileAddress: string
}

function fileTypesQuery(_: any, { sourceFileAddress }: FileTypesQueryArgs) {
  console.log('__fileTypesQuery__')

  const fileNode = getNodeByAddress<FileNodeType>(sourceFileAddress)

  if (!fileNode) {
    throw new Error(`File with address ${sourceFileAddress} not found`)
  }

  return {
    types: traverseTypes(fileNode),
    rawTypes: extractBetweenComments(fileNode, typesStartComment, typesEndComment),
  }
}

export default fileTypesQuery
