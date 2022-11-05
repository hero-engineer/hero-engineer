import traverseComponent from '../../domain/traversal/traverseComponent'
import { FileNodeType, FunctionNodeType, HierarchyItemType } from '../../types'

import { getNodesByFirstNeighbourg } from '../../graph'
import areArraysEqual from '../../utils/areArraysEqual'

type HierarchyQueryArgs = {
  sourceComponentAddress: string
  hierarchyIds: string[]
}

function hierarchyQuery(_: any, { sourceComponentAddress, hierarchyIds }: HierarchyQueryArgs) {
  console.log('__getHierarchy__')

  const hierarchy: HierarchyItemType[] = [] // retval
  const componentRootHierarchyIds: string[] = [] // retval

  let lastFileNode: FileNodeType | null = null
  let lastIndexRegistryHash = ''
  let lastComponentRootIndexes: number[] = []

  // On file traversal, add the component to the hierarchy
  function onTraverseFile(fileNodes: FileNodeType[], _indexRegistriesHash: string, componentRootIndexes: number[]) {
    const fileNode = fileNodes[fileNodes.length - 1]
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
  function onHierarchyPush(paths: any[], _fileNodes: FileNodeType[], _indexRegistriesHash: string, _componentRootIndexes: number[], componentIndex: number, hierarchyId: string) {
    const lastPath = paths[paths.length - 1]

    hierarchy.push({
      hierarchyId,
      label: `${lastPath.node.openingElement.name.name}[${componentIndex}]`,
      componentName: lastPath.node.openingElement.name.name,
    })
  }

  // On first pass success, Retrieve the state of the root component
  function onSuccess(_paths: any[], fileNodes: FileNodeType[], indexRegistryHash: string, componentRootIndexes: number[]) {
    lastFileNode = fileNodes[fileNodes.length - 1]
    lastIndexRegistryHash = indexRegistryHash
    lastComponentRootIndexes = componentRootIndexes
  }

  // On second pass, find componentRootHierarchyIds, which are the root DOM nodes of the last component in the Hierarchy
  // They are usefull for highlingting the root component
  // Skipping ensures only the root DOM nodes are traversed
  function onBeforeHierarchyPush(paths: any[], fileNodes: FileNodeType[], indexRegistryHash: string, componentRootIndexes: number[], _componentIndex: number, hierarchyId: string) {
    if (fileNodes[fileNodes.length - 1]?.address === lastFileNode?.address && indexRegistryHash === lastIndexRegistryHash && areArraysEqual(componentRootIndexes, lastComponentRootIndexes)) {
      componentRootHierarchyIds.push(hierarchyId)

      paths[paths.length - 1].skip()
    }
  }

  // First pass: retrieve hierarchy
  traverseComponent(sourceComponentAddress, hierarchyIds, {
    onTraverseFile,
    onHierarchyPush,
    onSuccess,
  })

  // console.log('!!!!!!!!!', lastFileNode!.payload.name, lastComponentRootIndexes)

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

export default hierarchyQuery
