import { FileNodeType, FunctionNodeType, HierarchyPositionType, HistoryMutationReturnType } from '../../types'

import { getNodeByAddress, getNodesBySecondNeighbourg } from '../../graph'

import compareCursors from '../../utils/compareCursors'

import composeHistoryMutation from '../../history/composeHistoryMutation'

import getComponentHierarchyCursors from '../../domain/getComponentHierarchyCursors'
import createAddComponentMutate from '../../domain/createAddComponentMutate'
import createAddComponentPostTraverse from '../../domain/createAddComponentPostTraverse'
import createDeleteComponentMutate from '../../domain/createDeleteComponentMutate'
import createDeleteComponentPostTraverse from '../../domain/createDeleteComponentPostTraverse'
import updateComponentHierarchy from '../../domain/updateComponentHierarchy'
import processImpactedFileNodes from '../../domain/processImpactedFileNodes'

type MoveComponentArgs = {
  sourceComponentAddress: string
  sourceHierarchyIds: string[]
  targetHierarchyIds: string[]
  hierarchyPosition: HierarchyPositionType
}

async function moveComponent(_: any, { sourceComponentAddress, sourceHierarchyIds, targetHierarchyIds, hierarchyPosition }: MoveComponentArgs): Promise<HistoryMutationReturnType<FunctionNodeType | null>> {
  console.log('___moveComponent___')

  const sourceComponentNode = getNodeByAddress(sourceComponentAddress)

  if (!sourceComponentNode) {
    throw new Error(`Component with id ${sourceComponentAddress} not found`)
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(sourceComponentNode.address, 'DeclaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${sourceComponentAddress} not found`)
  }

  console.log('sourceHierarchyIds', sourceHierarchyIds)
  console.log('targetHierarchyIds', targetHierarchyIds)

  const sourceCursors = getComponentHierarchyCursors(sourceComponentAddress, sourceHierarchyIds)
  const targetCursors = getComponentHierarchyCursors(sourceComponentAddress, targetHierarchyIds)

  console.log('sourceCursors', sourceCursors)
  console.log('targetCursors', targetCursors)

  const isSourceFirst = compareCursors(sourceCursors, targetCursors)

  console.log('isSourceFirst', isSourceFirst)

  return {
    returnValue: null,
    impactedFileNodes: [],
    description: `Move component ${sourceComponentNode.payload.name}`,
  }
}

export default composeHistoryMutation(moveComponent)
