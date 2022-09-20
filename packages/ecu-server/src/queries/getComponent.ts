import { FileType, getNodeByAddress, getNodesBySecondNeighbourg } from 'ecu-common'

import graph from '../graph'

import nodeWithId from '../utils/nodeWithId'

type GetComponentArgs = {
  id: string
}

function getComponent(_: any, { id }: GetComponentArgs) {
  const node = getNodeByAddress(graph, id)

  if (!node) return null

  return nodeWithId(node, {
    file: nodeWithId(getNodesBySecondNeighbourg<FileType>(graph, node.address, 'declaresFunction')[0]),
  })
}

export default getComponent
