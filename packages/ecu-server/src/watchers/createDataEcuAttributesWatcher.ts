import { FileNodeType, FunctionNodeType } from '../types'

import { getNodesByRole, getNodesBySecondNeighbourg } from '../graph'

import createHierarchyIdsAndKeys from '../domain/createDataEcuAttributes'
import regenerate from '../domain/regenerate'

async function createDataEcuAttributesWatcher() {
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(node => node.payload.isComponent)

  await Promise.all(componentNodes.map(async componentNode => {
    const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentNode.address, 'DeclaresFunction')[0]

    if (!fileNode) return

    const { ast } = fileNode.payload

    createHierarchyIdsAndKeys(componentNode, ast)

    await regenerate(fileNode, ast)
  }))
}

export default createDataEcuAttributesWatcher
