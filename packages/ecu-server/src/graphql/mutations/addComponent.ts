import { FileNodeType, FunctionNodeType, HierarchyPositionType, HistoryMutationReturnType } from '../../types'

import { getNodeByAddress, getNodesBySecondNeighbourg } from '../../graph'

import updateComponentHierarchy from '../../domain/updateComponentHierarchy'
import createAddComponentMutate from '../../domain/createAddComponentMutate'
import createAddComponentPostTraverse from '../../domain/createAddComponentPostTraverse'
import processImpactedFileNodes from '../../domain/processImpactedFileNodes'

type AddComponentArgs = {
  sourceComponentAddress: string
  targetComponentAddress: string
  hierarchyIds: string[]
  hierarchyPosition: HierarchyPositionType
}

async function addComponent(_: any, { sourceComponentAddress, targetComponentAddress, hierarchyIds, hierarchyPosition }: AddComponentArgs): Promise<HistoryMutationReturnType<FunctionNodeType | null>> {
  console.log('___addComponent___')

  const sourceComponentNode = getNodeByAddress(sourceComponentAddress)

  if (!sourceComponentNode) {
    throw new Error(`Component with id ${sourceComponentAddress} not found`)
  }

  const targetComponentNode = getNodeByAddress(targetComponentAddress)

  if (!targetComponentNode) {
    throw new Error(`Component with id ${targetComponentAddress} not found`)
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(sourceComponentNode.address, 'DeclaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${sourceComponentAddress} not found`)
  }

  const mutate = createAddComponentMutate(targetComponentNode, hierarchyPosition)
  const postTraverse = createAddComponentPostTraverse(targetComponentNode)
  const impacted = updateComponentHierarchy(fileNode, hierarchyIds, mutate)

  const { impactedFileNode, impactedComponentNode } = await processImpactedFileNodes(impacted, postTraverse)

  return {
    returnValue: impactedComponentNode,
    impactedFileNodes: impactedFileNode ? [impactedFileNode] : [],
    description: `Add component ${targetComponentNode.payload.name} to ${sourceComponentNode.payload.name}`,
  }
}

export default addComponent
