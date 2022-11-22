import { typesEndComment, typesStartComment } from '../../configuration.js'
import { FileNodeType } from '../../types.js'

import { getNodeByAddress } from '../../graph/index.js'
import traverseTypes from '../../domain/types/traverseTypes.js'
import extractBetweenComments from '../../domain/comments/extractBetweenComments.js'

type FileTypesQueryArgsType = {
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
    rawTypes: extractBetweenComments(fileNode.payload.code, typesStartComment, typesEndComment),
  }
}

export default fileTypesQuery
