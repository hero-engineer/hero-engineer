import { FileNodeType } from '../../types'

import graph from '../../graph'
import { getNodeByAddress, getNodesBySecondNeighbourg } from '../../graph/helpers'

import nodeWithId from '../../utils/nodeWithId'

type GetComponentArgs = {
  id: string
}

function getComponent(_: any, { id }: GetComponentArgs) {
  const node = getNodeByAddress(graph, id)

  if (!node) return null

  return nodeWithId(node, {
    file: nodeWithId(getNodesBySecondNeighbourg<FileNodeType>(graph, node.address, 'declaresFunction')[0]),
  })
}

export default getComponent
