import traverseComponent from '../../domain/traversal/traverseComponent'
import { FileNodeType, FunctionNodeType, HierarchyItemType } from '../../types'

import { getNodesByFirstNeighbourg } from '../../graph'
import areArraysEqual from '../../utils/areArraysEqual'

type GetComponentArgs = {
  sourceComponentAddress: string
  hierarchyIds: string[]
}

function getHierarchy(_: any, { sourceComponentAddress, hierarchyIds }: GetComponentArgs) {
  console.log('__getHierarchy__')

  const hierarchy: HierarchyItemType[] = [] // retval
  const componentRootHierarchyIds: string[] = [] // retval

  let lastFileNode: FileNodeType | null = null
  let lastIndexRegistryHash = ''
  let lastComponentRootIndexes: number[] = []
  let lastComponentIndex = -1

  function onTraverseFile(fileNode: FileNodeType, _indexRegistriesHash: string, componentRootIndexes: number[]) {
    const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

    if (!componentNode) {
      console.log(`No component node found in file ${fileNode.address}`)

      return () => {}
    }

    const label = `${componentNode.payload.name}[${componentRootIndexes[componentRootIndexes.length - 1]}]`

    hierarchy.push({
      label,
      componentAddress: componentNode.address,
      componentName: componentNode.payload.name,
    })

    return () => {
      for (let i = hierarchy.length - 1; i >= 0; i--) {
        const popped = hierarchy.pop()

        if (popped?.label === label) break
      }
    }
  }

  function onHierarchyPush(x: any, _fileNode: FileNodeType, _indexRegistriesHash: string, _componentRootIndexes: number[], componentIndex: number, hierarchyId: string) {
    hierarchy.push({
      hierarchyId,
      label: `${x.node.openingElement.name.name}[${componentIndex}]`,
      componentName: x.node.openingElement.name.name,
    })
  }

  function onSuccess(_x: any, fileNode: FileNodeType, indexRegistryHash: string, componentRootIndexes: number[], componentIndex: number) {
    lastFileNode = fileNode
    lastIndexRegistryHash = indexRegistryHash
    lastComponentRootIndexes = componentRootIndexes
    lastComponentIndex = componentIndex
  }

  function onBeforeHierarchyPush(x: any, fileNode: FileNodeType, indexRegistryHash: string, componentRootIndexes: number[], componentIndex: number, hierarchyId: string) {
    if (fileNode.address === lastFileNode?.address && indexRegistryHash === lastIndexRegistryHash && areArraysEqual(componentRootIndexes, lastComponentRootIndexes) && componentIndex === lastComponentIndex) {
      componentRootHierarchyIds.push(hierarchyId)

      x.skip()
    }
  }

  // Retrieve hierarchy
  traverseComponent(sourceComponentAddress, hierarchyIds, {
    onTraverseFile,
    onHierarchyPush,
    onSuccess,
  })

  console.log('XXXX', lastFileNode!.payload.name, lastComponentRootIndexes, lastComponentIndex)

  // Retrieve componentRootHierarchyIds
  traverseComponent(sourceComponentAddress, [], {
    onBeforeHierarchyPush,
  })

  console.log('hierarchy', hierarchy)
  console.log('componentRootHierarchyIds', componentRootHierarchyIds)

  return {
    hierarchy,
    componentRootHierarchyIds,
  }
}

export default getHierarchy
