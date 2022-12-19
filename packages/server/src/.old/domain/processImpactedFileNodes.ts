import { FileNodeType, FunctionNodeType, ImpactedType, PostTraverseType } from '../types.js'

import { getNodesByFirstNeighbourg } from '../graph/index.js'

import regenerate from './regenerate.js'

import updateDataHeroEngineerAttributes from './components/updateDataHeroEngineerAttributes.js'

type ProcessImpactedFileNodesResolveType = {
  impactedFileNode: FileNodeType | null
  impactedComponentNode: FunctionNodeType | null
}

async function processImpactedFileNodes(impacted: ImpactedType[], postTraverse: PostTraverseType = () => {}, refreshDataHeroEngineerAttributes = true): Promise<ProcessImpactedFileNodesResolveType> {
  let impactedFileNode: FileNodeType | null = null
  let impactedComponentNode: FunctionNodeType | null = null

  await Promise.all(impacted.map(async ({ fileNode, ast }) => {
    console.log('impacted:', fileNode.payload.name)

    postTraverse(fileNode, ast)

    const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

    if (!componentNode) return

    if (refreshDataHeroEngineerAttributes) {
      updateDataHeroEngineerAttributes(componentNode, ast)
    }

    const regenerated = await regenerate(fileNode, ast)

    if (regenerated) {
      impactedFileNode = fileNode
      impactedComponentNode = componentNode
    }
  }))

  return {
    impactedFileNode,
    impactedComponentNode,
  }
}

export default processImpactedFileNodes
