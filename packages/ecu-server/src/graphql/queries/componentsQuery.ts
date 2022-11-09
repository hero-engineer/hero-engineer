import { FunctionNodeType } from '../../types'

import { getNodesByRole, getNodesBySecondNeighbourg } from '../../graph'

function componentsQuery() {
  return getNodesByRole<FunctionNodeType>('Function').filter(node => node.payload.isComponent).map(node => {
    const fileNode = getNodesBySecondNeighbourg(node.address, 'DeclaresFunction')[0]

    if (!fileNode) {
      throw new Error(`File for component ${node.address} not found`)
    }

    return {
      component: node,
      file: fileNode,
    }
  })
}

export default componentsQuery
