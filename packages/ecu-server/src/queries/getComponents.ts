import { FunctionType, getNodesByRole } from 'ecu-common'

import graph from '../graph'

function getComponents() {
  return getNodesByRole<FunctionType>(graph, 'Function')
    .filter(node => node.payload.isComponent)
    .map(node => ({
      id: node.address,
      name: node.payload.name,
    }))
}

export default getComponents
