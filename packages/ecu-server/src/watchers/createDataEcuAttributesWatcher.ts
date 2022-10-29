import { FileNodeType, FunctionNodeType, GraphType } from '../types'

import { getNodesByRole, getNodesBySecondNeighbourg } from '../graph/helpers'

import createHierarchyIdsAndKeys from '../domain/createDataEcuAttributes'
import regenerate from '../domain/regenerate'

async function createDataEcuAttributesWatcher(graph: GraphType) {
  const componentNodes = getNodesByRole<FunctionNodeType>(graph, 'Function').filter(node => node.payload.isComponent)

  await Promise.all(componentNodes.map(async componentNode => {
    const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, componentNode.address, 'declaresFunction')[0]

    if (!fileNode) return

    const { ast } = fileNode.payload

    createHierarchyIdsAndKeys(componentNode, ast)
    regenerate(fileNode, ast)
  }))
}

export default createDataEcuAttributesWatcher
