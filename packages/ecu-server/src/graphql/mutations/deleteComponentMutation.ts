import { FunctionNodeType, HistoryMutationReturnType } from '../../types'

import { getNodeByAddress } from '../../graph'

import composeHistoryMutation from '../../history/composeHistoryMutation'

import processImpactedFileNodes from '../../domain/traversal/processImpactedFileNodes'
import createDeleteComponentPostTraverse from '../../domain/traversal/factories/createDeleteComponentPostTraverse'
import traverseComponent from '../../domain/traversal/traverseComponent'
import applyComponentDelta from '../../domain/utils/applyComponentDelta'

type DeleteComponentMutationArgs = {
  sourceComponentAddress: string
  hierarchyIds: string[]
  componentDelta: number
}

async function deleteComponentMutation(_: any, { sourceComponentAddress, hierarchyIds, componentDelta }: DeleteComponentMutationArgs): Promise<HistoryMutationReturnType<FunctionNodeType | null>> {
  console.log('___deleteComponent___')

  const componentNode = getNodeByAddress<FunctionNodeType>(sourceComponentAddress)

  if (!componentNode) {
    throw new Error(`Component with id ${sourceComponentAddress} not found`)
  }

  if (componentDelta > 0) {
    throw new Error('Positive componentDelta not supported')
  }

  function onSuccess(paths: any[]) {
    const finalPath = applyComponentDelta(paths, componentDelta)

    finalPath.remove()
  }

  const postTraverse = createDeleteComponentPostTraverse()
  const impacted = traverseComponent(sourceComponentAddress, hierarchyIds, {
    onSuccess,
  })

  const { impactedFileNode, impactedComponentNode } = await processImpactedFileNodes(impacted, postTraverse)

  return {
    returnValue: impactedComponentNode,
    impactedFileNodes: impactedFileNode ? [impactedFileNode] : [],
    description: `Delete component ${impactedComponentNode?.payload.name} in ${componentNode.payload.name}`,
  }
}

export default composeHistoryMutation(deleteComponentMutation)
