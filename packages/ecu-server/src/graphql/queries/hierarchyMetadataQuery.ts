import { FileNodeType } from '../../types'

import { getNodesBySecondNeighbourg } from '../../graph'

import traverseComponent from '../../domain/traversal/traverseComponent'
import applyComponentDelta from '../../domain/utils/applyComponentDelta'

import areArraysEqual from '../../utils/areArraysEqual'

type HierarchyMetadataQueryArgs = {
  sourceComponentAddress: string
  hierarchyIds: string[]
  componentDelta: number
}

function hierarchyMetadataQuery(_: any, { sourceComponentAddress, hierarchyIds, componentDelta }: HierarchyMetadataQueryArgs) {
  console.log('__isHierarchyOnComponent__', hierarchyIds, componentDelta)

  const sourceFileNode = getNodesBySecondNeighbourg<FileNodeType>(sourceComponentAddress, 'DeclaresFunction')[0]

  if (!sourceFileNode) {
    throw new Error(`No file node found for component ${sourceComponentAddress}`)
  }

  if (componentDelta > 0) {
    throw new Error('Positive componentDelta not supported')
  }

  let isHierarchyOnComponent = false // retval
  const componentRootHierarchyIds: string[] = [] // retval

  let lastFileNode: FileNodeType | null = null
  // let lastIndexRegistryHash = ''
  // let lastComponentRootIndexes: number[] = []

  // On first pass success, Retrieve the state of the root component
  // Also determine if the hierarchy is on the component
  function onSuccess(_paths: any[], fileNodes: FileNodeType[], indexRegistryHash: string, componentRootIndexes: number[]) {

    console.log('?????????', fileNodes.map(x => x.payload.name), componentDelta)

    lastFileNode = applyComponentDelta(fileNodes, componentDelta)

    // console.log('lastFileNode.payload.name', lastFileNode.payload.name)

    isHierarchyOnComponent = lastFileNode.address === sourceFileNode.address
    // lastIndexRegistryHash = indexRegistryHash
    // lastComponentRootIndexes = componentRootIndexes
  }

  traverseComponent(sourceComponentAddress, hierarchyIds, {
    // onSuccess,
  })

  // On second pass, find componentRootHierarchyIds, which are the root DOM nodes of the last component in the Hierarchy
  // They are usefull for highlingting the root component
  // Skipping ensures only the root DOM nodes are traversed
  function onBeforeHierarchyPush(paths: any[], fileNodes: FileNodeType[], indexRegistryHash: string, componentRootIndexes: number[], _componentIndex: number, hierarchyId: string) {
    // const finalFileNode = applyComponentDelta(fileNodes, componentDelta)

    // console.log('hierarchyId', hierarchyId)
    // console.log('finalFileNode.payload.name', finalFileNode.payload.name, indexRegistryHash === lastIndexRegistryHash, areArraysEqual(componentRootIndexes, lastComponentRootIndexes))
    // if (finalFileNode?.address === lastFileNode?.address && indexRegistryHash === lastIndexRegistryHash && areArraysEqual(componentRootIndexes, lastComponentRootIndexes)) {
    componentRootHierarchyIds.push(hierarchyId)

    paths[paths.length - 1].skip()
    // }
  }

  console.log('!!!!!!!!!', lastFileNode!.payload.name)

  // Second pass: retrieve componentRootHierarchyIds
  traverseComponent(sourceComponentAddress, [], {
    // onBeforeHierarchyPush,
  })

  console.log('componentRootHierarchyIds', componentRootHierarchyIds)

  return {
    isHierarchyOnComponent,
    componentRootHierarchyIds,
  }
}

export default hierarchyMetadataQuery
