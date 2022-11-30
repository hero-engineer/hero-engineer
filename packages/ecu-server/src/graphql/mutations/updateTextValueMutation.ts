import { JSXElement, JSXIdentifier, jsxClosingElement, jsxExpressionContainer, jsxIdentifier, jsxText, stringLiteral } from '@babel/types'
import { NodePath } from '@babel/traverse'

import { HistoryMutationReturnType } from '../../types.js'

import { getNodeByAddress } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import traverseComponent from '../../domain/components/traverseComponent.js'
import processImpactedFileNodes from '../../domain/processImpactedFileNodes.js'

type UpdateTextValueMutationArgsType = {
  sourceComponentAddress: string
  targetHierarchyId: string
  value: string
}

async function updateTextValueMutation(_: any, { sourceComponentAddress, targetHierarchyId, value }: UpdateTextValueMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  const sourceComponentNode = getNodeByAddress(sourceComponentAddress)

  if (!sourceComponentNode) {
    throw new Error(`Component with id ${sourceComponentAddress} not found`)
  }

  function onSuccess(paths: NodePath<JSXElement>[]) {
    const finalPath = paths[paths.length - 1]

    const child = value.includes('\n') || value.trim() !== value ? jsxExpressionContainer(stringLiteral(value)) : jsxText(value)

    if (finalPath.node.openingElement.selfClosing) {
      finalPath.node.selfClosing = false
      finalPath.node.openingElement.selfClosing = false
      finalPath.node.closingElement = jsxClosingElement(jsxIdentifier((finalPath.node.openingElement.name as JSXIdentifier).name))
    }

    finalPath.node.children = [child]
  }

  try {
    const { impacted } = traverseComponent(sourceComponentAddress, targetHierarchyId, onSuccess)

    await processImpactedFileNodes(impacted)

    return {
      returnValue: true,
      description: `Edit text on component ${sourceComponentNode.payload.name}`,
    }
  }
  catch (error) {
    console.log(error)

    throw new Error('Traversal error')
  }
}

export default composeHistoryMutation(updateTextValueMutation)
