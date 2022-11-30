import { JSXElement, jsxAttribute, jsxIdentifier } from '@babel/types'
import { NodePath } from '@babel/traverse'

import { HistoryMutationReturnType } from '../../types.js'

import { getNodeByAddress } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import traverseComponent from '../../domain/components/traverseComponent.js'
import processImpactedFileNodes from '../../domain/processImpactedFileNodes.js'
import { ecuDisplayNameCommentPrefix } from '../../configuration.js'
import applyComponentDelta from '../../domain/utils/applyComponentDelta.js'

type UpdateHierarchyDisplayNameMutationArgsType = {
  sourceComponentAddress: string
  targetHierarchyId: string
  componentDelta: number
  value: string
}

async function updateHierarchyDisplayNameMutation(_: any, { sourceComponentAddress, targetHierarchyId, componentDelta, value }: UpdateHierarchyDisplayNameMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  const sourceComponentNode = getNodeByAddress(sourceComponentAddress)

  if (!sourceComponentNode) {
    throw new Error(`Component with id ${sourceComponentAddress} not found`)
  }

  function onSuccess(paths: NodePath<JSXElement>[]) {
    const finalPath = applyComponentDelta(paths, componentDelta)

    if (!finalPath.node.openingElement.leadingComments) {
      finalPath.node.openingElement.leadingComments = []
    }

    const comments = finalPath.node.openingElement.name.trailingComments || []
    const existingCommentIndex = comments.findIndex(c => c.value.trim().startsWith(ecuDisplayNameCommentPrefix))

    if (existingCommentIndex !== -1) {
      comments.splice(existingCommentIndex, 1)
    }

    if (value) {
      comments.push({
        type: 'CommentLine',
        value: ` ${ecuDisplayNameCommentPrefix}${value}`,
      })
    }

    finalPath.node.openingElement.name.trailingComments = comments
  }

  try {
    const { impacted } = traverseComponent(sourceComponentAddress, targetHierarchyId, onSuccess)

    await processImpactedFileNodes(impacted)

    return {
      returnValue: true,
      description: `Edit hierarchy display name on ${sourceComponentNode.payload.name}`,
    }
  }
  catch (error) {
    console.log(error)

    throw new Error('Traversal error')
  }
}

export default composeHistoryMutation(updateHierarchyDisplayNameMutation)
