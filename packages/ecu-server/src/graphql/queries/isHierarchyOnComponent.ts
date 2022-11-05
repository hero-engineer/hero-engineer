import traverseComponent from '../../domain/traversal/traverseComponent'
import { FileNodeType } from '../../types'

import { getNodesBySecondNeighbourg } from '../../graph'

type IsHierarchyOnComponentArgs = {
  sourceComponentAddress: string
  hierarchyIds: string[]
  componentDelta: number
}

function isHierarchyOnComponent(_: any, { sourceComponentAddress, hierarchyIds, componentDelta }: IsHierarchyOnComponentArgs) {
  console.log('__isHierarchyOnComponent__')

  const sourceFileNode = getNodesBySecondNeighbourg<FileNodeType>(sourceComponentAddress, 'DeclaresFunction')[0]

  if (!sourceFileNode) {
    throw new Error(`No file node found for component ${sourceComponentAddress}`)
  }

  if (componentDelta > 0) {
    throw new Error('Positive componentDelta not supported')
  }

  let isHierarchyOnComponentRetval = false

  function onSuccess(_paths: any[], fileNodes: FileNodeType[]) {
    isHierarchyOnComponentRetval = fileNodes.map(fileNode => fileNode.address)[fileNodes.length - 1 + componentDelta] === sourceFileNode.address
  }

  traverseComponent(sourceComponentAddress, hierarchyIds, {
    onSuccess,
  })

  return isHierarchyOnComponentRetval
}

export default isHierarchyOnComponent
