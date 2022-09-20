import { FileType, FunctionType, getNodesByRole, getNodesBySecondNeighbourg } from 'ecu-common'

import graph from '../graph'

import nodeWithId from '../utils/nodeWithId'

// TODO use model
function getComponents() {
  return getNodesByRole<FunctionType>(graph, 'Function')
    .filter(node => node.payload.isComponent)
    .map(node => nodeWithId(node, {
      file: nodeWithId(getNodesBySecondNeighbourg<FileType>(graph, node.address, 'declaresFunction')[0]),
    }))
}

export default getComponents
