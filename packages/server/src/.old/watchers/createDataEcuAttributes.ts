import { FileNodeType, FunctionNodeType } from '../types.js'

import { getNodesByRole, getNodesBySecondNeighbourg } from '../graph/index.js'

import regenerate from '../domain/regenerate.js'
import updateDataHeroEngineerAttributes from '../domain/components/updateDataHeroEngineerAttributes.js'

async function createDataHeroEngineerAttributes() {
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(node => node.payload.isComponent)

  await Promise.all(componentNodes.map(async componentNode => {
    const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentNode.address, 'DeclaresFunction')[0]

    if (!fileNode) return

    const { ast } = fileNode.payload

    updateDataHeroEngineerAttributes(componentNode, ast)

    await regenerate(fileNode, ast)
  }))
}

export default createDataHeroEngineerAttributes
