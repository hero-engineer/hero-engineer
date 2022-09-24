import { FileNodeType, FunctionNodeType, getNodesByRole, getNodesBySecondNeighbourg } from 'ecu-common'

import graph from '../graph'

import nodeWithId from '../utils/nodeWithId'

// TODO use model
function getComponents() {
  return getNodesByRole<FunctionNodeType>(graph, 'Function')
    .filter(node => node.payload.isComponent)
    .map(node => nodeWithId(node, {
      file: nodeWithId(getNodesBySecondNeighbourg<FileNodeType>(graph, node.address, 'declaresFunction')[0]),
    }))
}

export default getComponents
