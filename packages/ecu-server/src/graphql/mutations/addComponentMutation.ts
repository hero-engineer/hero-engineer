import {
  FunctionNodeType,
  HierarchyPositionType,
  HistoryMutationReturnType,
  PostTraverseType,
  TraverseComponentOnSuccessType,
} from '../../types.js'
import { ecuAtomPrefix, ecuAtoms } from '../../configuration.js'

import { getNodeByAddress } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import createAddComponentOnSuccess from '../../domain/components/createAddComponentOnSuccess.js'
import createAddUserComponentPostTraverse from '../../domain/components/createAddUserComponentPostTraverse.js'
import createAddAtomComponentPostTraverse from '../../domain/components/createAddAtomComponentPostTraverse.js'
import traverseComponent from '../../domain/components/traverseComponent.js'
import processImpactedFileNodes from '../../domain/processImpactedFileNodes.js'

type AddComponentMutationArgs = {
  sourceComponentAddress: string
  targetComponentAddress: string
  targetHierarchyId: string
  hierarchyPosition: HierarchyPositionType
  componentDelta: number
}

async function addComponentMutation(_: any, { sourceComponentAddress, targetComponentAddress, targetHierarchyId, hierarchyPosition, componentDelta }: AddComponentMutationArgs): Promise<HistoryMutationReturnType<FunctionNodeType | null>> {
  console.log('__addComponentMutation__')

  const sourceComponentNode = getNodeByAddress(sourceComponentAddress)

  if (!sourceComponentNode) {
    throw new Error(`Component with id ${sourceComponentAddress} not found`)
  }

  let name = ''
  let postTraverse: PostTraverseType
  let onSuccess: TraverseComponentOnSuccessType

  if (targetComponentAddress.startsWith(ecuAtomPrefix)) {
    const targetAtom = ecuAtoms.find(x => x.id === targetComponentAddress)

    if (!targetAtom) {
      throw new Error(`Atom with id ${targetComponentAddress} not found`)
    }

    name = targetAtom.name
    postTraverse = createAddAtomComponentPostTraverse(targetAtom)
    onSuccess = createAddComponentOnSuccess(targetAtom.name, targetAtom.defaultChildren, hierarchyPosition, componentDelta)
  }
  else {
    const targetComponentNode = getNodeByAddress(targetComponentAddress)

    if (!targetComponentNode) {
      throw new Error(`Component with id ${targetComponentAddress} not found`)
    }

    name = targetComponentNode.payload.name
    postTraverse = createAddUserComponentPostTraverse(targetComponentNode)
    onSuccess = createAddComponentOnSuccess(targetComponentNode.payload.name, [], hierarchyPosition, componentDelta)
  }

  try {
    const { impacted } = traverseComponent(sourceComponentAddress, targetHierarchyId, onSuccess)
    const { impactedComponentNode } = await processImpactedFileNodes(impacted, postTraverse, true)

    return {
      returnValue: impactedComponentNode,
      description: `Add component ${name} to ${sourceComponentNode.payload.name}`,
    }
  }
  catch (error) {
    console.log(error)

    throw new Error('Traversal error')
  }
}

export default composeHistoryMutation(addComponentMutation)
