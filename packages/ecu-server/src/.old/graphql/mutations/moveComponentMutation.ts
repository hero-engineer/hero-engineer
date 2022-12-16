import { FileNodeType, FunctionNodeType, HierarchyPositionType, HistoryMutationReturnType } from '../../types.js'

import { getNodeByAddress, getNodesBySecondNeighbourg } from '../../graph/index.js'

import compareCursors from '../../utils/compareCursors.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

// import getComponentHierarchyCursors from '../../domain/traversal/getComponentHierarchyCursors'
// import updateComponentHierarchy from '../../domain/traversal/updateComponentHierarchy'
// import processImpactedFileNodes from '../../domain/traversal/processImpactedFileNodes'
// import getComponentHierarchy from '../../domain/traversal/getComponentHierarchy'
// import createAddComponentMutate from '../../domain/traversal/factories/createAddComponentMutate'
// import createAddComponentPostTraverse from '../../domain/traversal/factories/createAddComponentPostTraverse'
// import createDeleteComponentMutate from '../../domain/traversal/factories/createDeleteComponentMutate'
// import createDeleteComponentPostTraverse from '../../domain/traversal/factories/createDeleteComponentPostTraverse'

type MoveComponentMutationArgsType = {
  sourceComponentAddress: string
  sourceHierarchyId: string
  targetHierarchyId: string
  hierarchyPosition: HierarchyPositionType
}

async function moveComponentMutation(_: any, { sourceComponentAddress, sourceHierarchyId, targetHierarchyId, hierarchyPosition }: MoveComponentMutationArgsType): Promise<void> {
// async function moveComponentMutation(_: any, { sourceComponentAddress, sourceHierarchyIds, targetHierarchyIds, hierarchyPosition }: MoveComponentMutationArgsType): Promise<HistoryMutationReturnType<FunctionNodeType | null>> {
  // const sourceComponentNode = getNodeByAddress(sourceComponentAddress)

  // if (!sourceComponentNode) {
  //   throw new Error(`Component with id ${sourceComponentAddress} not found`)
  // }

  // const fileNode = getNodesBySecondNeighbourg<FileNodeType>(sourceComponentNode.address, 'DeclaresFunction')[0]

  // if (!fileNode) {
  //   throw new Error(`File for Function with id ${sourceComponentAddress} not found`)
  // }

  // console.log('sourceHierarchyIds', sourceHierarchyIds)
  // console.log('targetHierarchyIds', targetHierarchyIds)

  // const sourceCursors = getComponentHierarchyCursors(sourceComponentAddress, sourceHierarchyIds)
  // const targetCursors = getComponentHierarchyCursors(sourceComponentAddress, targetHierarchyIds)

  // // const
  // console.log('sourceCursors', sourceCursors)
  // console.log('targetCursors', targetCursors)

  // const isSourceFirst = compareCursors(sourceCursors, targetCursors)

  // console.log('isSourceFirst', isSourceFirst)

  // // const sourceHierarchy = getComponentHierarchy(sourceComponentAddress, sourceHierarchyIds) // ?

  // // const insertedComponentAddress = extractInserted(sourceHierarchy)
  // // const componeNodeToInsert = //

  // const deleteMutate = createDeleteComponentMutate()
  // const deletePostTraverse = createDeleteComponentPostTraverse()
  // // const addMutate = createAddComponentMutate(sourceComponentNode, hierarchyPosition)

  // return {
  //   returnValue: null,
  //   impactedFileNodes: [],
  //   description: `Move component ${sourceComponentNode.payload.name}`,
  // }
}

// export default composeHistoryMutation(moveComponentMutation)
export default moveComponentMutation
