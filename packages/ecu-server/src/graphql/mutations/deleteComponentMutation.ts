import { NodePath } from '@babel/traverse'
import { JSXElement, JSXIdentifier } from '@babel/types'

import { FunctionNodeType, HistoryMutationReturnType } from '../../types.js'

import { getNodeByAddress } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import processImpactedFileNodes from '../../domain/processImpactedFileNodes.js'
import traverseComponent from '../../domain/components/traverseComponent.js'
import applyComponentDelta from '../../domain/utils/applyComponentDelta.js'

type DeleteComponentMutationArgsType = {
  sourceComponentAddress: string
  targetHierarchyId: string
  componentDelta: number
}

async function deleteComponentMutation(_: any, { sourceComponentAddress, targetHierarchyId, componentDelta }: DeleteComponentMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  console.log('__deleteComponentMutation__')

  const componentNode = getNodeByAddress<FunctionNodeType>(sourceComponentAddress)

  if (!componentNode) {
    throw new Error(`Component with id ${sourceComponentAddress} not found`)
  }

  if (componentDelta > 0) {
    throw new Error('Positive componentDelta not supported')
  }

  let name = ''

  function onSuccess(paths: NodePath<JSXElement>[]) {
    const finalPath = applyComponentDelta(paths, componentDelta)

    name = (finalPath.node.openingElement.name as JSXIdentifier).name

    finalPath.remove()
  }

  const { impacted } = traverseComponent(sourceComponentAddress, targetHierarchyId, onSuccess)

  await processImpactedFileNodes(impacted)

  return {
    returnValue: true,
    description: `Delete component ${name} in ${componentNode.payload.name}`,
  }
}

export default composeHistoryMutation(deleteComponentMutation)
