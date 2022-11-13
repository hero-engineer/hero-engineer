import {
  jsxClosingElement,
  jsxClosingFragment,
  jsxElement,
  jsxFragment,
  jsxIdentifier,
  jsxOpeningElement,
  jsxOpeningFragment,
} from '@babel/types'

import { FileNodeType, FunctionNodeType, HierarchyPositionType, HistoryMutationReturnType } from '../../types'

import { getNodeByAddress, getNodesBySecondNeighbourg } from '../../graph'

import composeHistoryMutation from '../../history/composeHistoryMutation'

import createAddComponentPostTraverse from '../../domain/components/createAddComponentPostTraverse'
import traverseComponent from '../../domain/components/traverseComponent'
import processImpactedFileNodes from '../../domain/processImpactedFileNodes'

type AddComponentMutationArgs = {
  sourceComponentAddress: string
  targetComponentAddress: string
  hierarchyIds: string[]
  hierarchyPosition: HierarchyPositionType
  componentDelta: number
}

async function addComponentMutation(_: any, { sourceComponentAddress, targetComponentAddress, hierarchyIds, hierarchyPosition, componentDelta }: AddComponentMutationArgs): Promise<HistoryMutationReturnType<FunctionNodeType | null>> {
  console.log('___addComponentMutation___')

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
    throw new Error(`File for component with id ${sourceComponentAddress} not found`)
  }

  function onSuccess(paths: any[]) {
    const finalPath = paths[paths.length - 1 + componentDelta]

    if (hierarchyPosition === 'before') {
      let inserted: any = jsxElement(jsxOpeningElement(jsxIdentifier(targetComponentNode.payload.name), [], true), null, [], true)

      if (finalPath.parent.type !== 'JSXElement' && finalPath.parent.type !== 'JSXFragment') {
        inserted = jsxFragment(jsxOpeningFragment(), jsxClosingFragment(), [inserted, finalPath.node])

        finalPath.replaceWith(inserted)
      }
      else {
        finalPath.insertAfter(inserted)
      }
    }
    else if (hierarchyPosition === 'after') {
      let inserted: any = jsxElement(jsxOpeningElement(jsxIdentifier(targetComponentNode.payload.name), [], true), null, [], true)

      if (finalPath.parent.type !== 'JSXElement' && finalPath.parent.type !== 'JSXFragment') {
        inserted = jsxFragment(jsxOpeningFragment(), jsxClosingFragment(), [finalPath.node, inserted])

        finalPath.replaceWith(inserted)
      }
      else {
        finalPath.insertAfter(inserted)
      }
    }
    else if (hierarchyPosition === 'children') {
      const inserted = jsxElement(jsxOpeningElement(jsxIdentifier(targetComponentNode.payload.name), [], true), null, [], true)

      finalPath.node.children.push(inserted)
    }
    else if (hierarchyPosition === 'parent') {
      const identifier = jsxIdentifier(targetComponentNode.payload.name)
      const inserted = jsxElement(jsxOpeningElement(identifier, [], false), jsxClosingElement(identifier), [finalPath.node], false)

      finalPath.replaceWith(inserted)
    }
  }

  const postTraverse = createAddComponentPostTraverse(targetComponentNode)
  const { impacted } = traverseComponent(sourceComponentAddress, hierarchyIds, {
    onSuccess,
  })

  const { impactedFileNode, impactedComponentNode } = await processImpactedFileNodes(impacted, postTraverse, true)

  return {
    returnValue: impactedComponentNode,
    impactedFileNodes: impactedFileNode ? [impactedFileNode] : [],
    description: `Add component ${targetComponentNode.payload.name} to ${sourceComponentNode.payload.name}`,
  }
}

export default composeHistoryMutation(addComponentMutation)
