import { FileNodeType, FunctionNodeType, HistoryMutationReturnType } from '../../types'

import { getNodeByAddress, getNodesBySecondNeighbourg } from '../../graph'

import composeHistoryMutation from '../../history/composeHistoryMutation'

import updateComponentHierarchy from '../../domain/updateComponentHierarchy'
import createDeleteComponentMutate from '../../domain/createDeleteComponentMutate'
import createDeleteComponentPostTraverse from '../../domain/createDeleteComponentPostTraverse'
import processImpactedFileNodes from '../../domain/processImpactedFileNodes'

type DeleteComponentArgs = {
  sourceComponentAddress: string
  hierarchyIds: string[]
}

async function deleteComponent(_: any, { sourceComponentAddress, hierarchyIds }: DeleteComponentArgs): Promise<HistoryMutationReturnType<FunctionNodeType | null>> {
  console.log('___deleteComponent___')

  const componentNode = getNodeByAddress(sourceComponentAddress)

  if (!componentNode) {
    throw new Error(`File for Function with id ${sourceComponentAddress} not found`)
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentNode.address, 'DeclaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${sourceComponentAddress} not found`)
  }

  const mutate = createDeleteComponentMutate()
  const postTraverse = createDeleteComponentPostTraverse()
  const impacted = updateComponentHierarchy(fileNode, hierarchyIds, mutate)

  const { impactedFileNode, impactedComponentNode } = await processImpactedFileNodes(impacted, postTraverse)

  return {
    returnValue: impactedComponentNode,
    impactedFileNodes: impactedFileNode ? [impactedFileNode] : [],
    description: `Delete component ${componentNode.payload.name} in ${componentNode.payload.name}`,
  }
}

export default composeHistoryMutation(deleteComponent)
