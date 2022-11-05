import { FileNodeType, FunctionNodeType, HierarchyPositionType, HistoryMutationReturnType } from '../../types'

import { getNodeByAddress, getNodesBySecondNeighbourg } from '../../graph'

import compareCursors from '../../utils/compareCursors'

import composeHistoryMutation from '../../history/composeHistoryMutation'

import getComponentHierarchyCursors from '../../domain/traversal/getComponentHierarchyCursors'
// import updateComponentHierarchy from '../../domain/traversal/updateComponentHierarchy'
// import processImpactedFileNodes from '../../domain/traversal/processImpactedFileNodes'
// import getComponentHierarchy from '../../domain/traversal/getComponentHierarchy'
// import createAddComponentMutate from '../../domain/traversal/factories/createAddComponentMutate'
// import createAddComponentPostTraverse from '../../domain/traversal/factories/createAddComponentPostTraverse'
import createDeleteComponentMutate from '../../domain/traversal/factories/createDeleteComponentMutate'
import createDeleteComponentPostTraverse from '../../domain/traversal/factories/createDeleteComponentPostTraverse'

type MoveComponentMutationArgs = {
  sourceComponentAddress: string
  sourceHierarchyIds: string[]
  targetHierarchyIds: string[]
  hierarchyPosition: HierarchyPositionType
}

async function moveComponentMutation(_: any, { sourceComponentAddress, sourceHierarchyIds, targetHierarchyIds, hierarchyPosition }: MoveComponentMutationArgs): Promise<void> {
// async function moveComponentMutation(_: any, { sourceComponentAddress, sourceHierarchyIds, targetHierarchyIds, hierarchyPosition }: MoveComponentMutationArgs): Promise<HistoryMutationReturnType<FunctionNodeType | null>> {
  // console.log('___moveComponent___')

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
