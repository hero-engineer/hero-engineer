import { FileNodeType, FunctionNodeType } from '../types'

import { getNodesByRole, getNodesBySecondNeighbourg } from '../graph'

import regenerate from '../domain/regenerate'
import updateDataEcuAttributes from '../domain/components/updateDataEcuAttributes'

async function createDataEcuAttributesWatcher() {
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(node => node.payload.isComponent)

  await Promise.all(componentNodes.map(async componentNode => {
    const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentNode.address, 'DeclaresFunction')[0]

    if (!fileNode) return

    const { ast } = fileNode.payload

    updateDataEcuAttributes(componentNode, ast)

    await regenerate(fileNode, ast)
  }))
}

export default createDataEcuAttributesWatcher
