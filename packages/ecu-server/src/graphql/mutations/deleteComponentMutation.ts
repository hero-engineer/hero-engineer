import { FunctionNodeType, HistoryMutationReturnType } from '../../types.js'

import { getNodeByAddress } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import processImpactedFileNodes from '../../domain/processImpactedFileNodes.js'
import traverseComponent from '../../domain/components/traverseComponent.js'
import applyComponentDelta from '../../domain/utils/applyComponentDelta.js'

type DeleteComponentMutationArgs = {
  sourceComponentAddress: string
  targetHierarchyId: string
  componentDelta: number
}

async function deleteComponentMutation(_: any, { sourceComponentAddress, targetHierarchyId, componentDelta }: DeleteComponentMutationArgs): Promise<HistoryMutationReturnType<FunctionNodeType | null>> {
  console.log('___deleteComponentMutation___')

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

  const { impacted } = traverseComponent(sourceComponentAddress, targetHierarchyId, onSuccess)

  const { impactedComponentNode } = await processImpactedFileNodes(impacted)

  return {
    returnValue: impactedComponentNode,
    description: `Delete component ${impactedComponentNode?.payload.name} in ${componentNode.payload.name}`,
  }
}

export default composeHistoryMutation(deleteComponentMutation)
