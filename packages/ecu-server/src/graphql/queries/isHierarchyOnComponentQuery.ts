import traverseComponent from '../../domain/traversal/traverseComponent'
import { FileNodeType } from '../../types'

import { getNodesBySecondNeighbourg } from '../../graph'

type IsHierarchyOnComponentQueryArgs = {
  sourceComponentAddress: string
  hierarchyIds: string[]
  componentDelta: number
}

function isHierarchyOnComponentQuery(_: any, { sourceComponentAddress, hierarchyIds, componentDelta }: IsHierarchyOnComponentQueryArgs) {
  console.log('__isHierarchyOnComponent__')

  const sourceFileNode = getNodesBySecondNeighbourg<FileNodeType>(sourceComponentAddress, 'DeclaresFunction')[0]

  if (!sourceFileNode) {
    throw new Error(`No file node found for component ${sourceComponentAddress}`)
  }

  if (componentDelta > 0) {
    throw new Error('Positive componentDelta not supported')
  }

  let isHierarchyOnComponent = false

  function onSuccess(_paths: any[], fileNodes: FileNodeType[]) {
    isHierarchyOnComponent = fileNodes.map(fileNode => fileNode.address)[fileNodes.length - 1 + componentDelta] === sourceFileNode.address
  }

  traverseComponent(sourceComponentAddress, hierarchyIds, {
    onSuccess,
  })

  return isHierarchyOnComponent
}

export default isHierarchyOnComponentQuery
