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

  // On file traversal, add the component to the hierarchy
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

  // On DOM node traversal, add the hierarchyId to the hierarchy
  function onHierarchyPush(x: any, _fileNode: FileNodeType, _indexRegistriesHash: string, _componentRootIndexes: number[], componentIndex: number, hierarchyId: string) {
    hierarchy.push({
      hierarchyId,
      label: `${x.node.openingElement.name.name}[${componentIndex}]`,
      componentName: x.node.openingElement.name.name,
    })
  }

  // On first pass success, Retrieve the state of the root component
  function onSuccess(_x: any, fileNode: FileNodeType, indexRegistryHash: string, componentRootIndexes: number[]) {
    lastFileNode = fileNode
    lastIndexRegistryHash = indexRegistryHash
    lastComponentRootIndexes = componentRootIndexes
  }

  // On second pass, find componentRootHierarchyIds, which are the root DOM nodes of the last component in the Hierarchy
  // They are usefull for highlingting the root component
  // Skipping ensures only the root DOM nodes are traversed
  function onBeforeHierarchyPush(x: any, fileNode: FileNodeType, indexRegistryHash: string, componentRootIndexes: number[], _componentIndex: number, hierarchyId: string) {
    if (fileNode.address === lastFileNode?.address && indexRegistryHash === lastIndexRegistryHash && areArraysEqual(componentRootIndexes, lastComponentRootIndexes)) {
      componentRootHierarchyIds.push(hierarchyId)

      x.skip()
    }
  }

  // First pass: retrieve hierarchy
  traverseComponent(sourceComponentAddress, hierarchyIds, {
    onTraverseFile,
    onHierarchyPush,
    onSuccess,
  })

  // Second pass: retrieve componentRootHierarchyIds
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
