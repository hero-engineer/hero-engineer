import fs from 'fs'

import generate from '@babel/generator'
import {
  jsxElement,
  jsxIdentifier,
  jsxOpeningElement,
} from '@babel/types'

import { FileNodeType, HierarchyPositionType } from '../../types'

import graph from '../../graph'
import { getNodeById, getNodesBySecondNeighbourg } from '../../graph/helpers'

import keepLastComponentOfHierarchy from '../../domain/keepLastComponentOfHierarchyIds'
import updateComponentHierarchy from '../../domain/updateComponentHierarchy'
import createAddMissingImportsPostTraversal from '../../domain/createAddMissingImportsPostTraversal'
import lintCode from '../../domain/lintCode'

type AddComponentArgs = {
  componentId: string
  hierarchyIds: string[]
  hierarchyPosition: HierarchyPositionType
}

async function addComponent(_: any, { componentId, hierarchyIds, hierarchyPosition }: AddComponentArgs) {
  console.log('___addComponent___')

  const componentNode = getNodeById(graph, componentId)

  if (!componentNode) {
    throw new Error(`Component with id ${componentId} not found`)
  }

  const reducedHierarchyIds = keepLastComponentOfHierarchy(hierarchyIds, hierarchyPosition === 'within' ? 1 : 2)

  console.log('hierarchyIds', hierarchyIds)
  console.log('reducedHierarchy', reducedHierarchyIds)

  const [functionNodeId] = reducedHierarchyIds[0].split(':')
  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, functionNodeId, 'declaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${functionNodeId} not found`)
  }

  function mutate(x: any, previousX: any) {
    const inserted = jsxElement(jsxOpeningElement(jsxIdentifier(componentNode.payload.name), [], true), null, [], true)

    if (hierarchyPosition === 'before') {
      (previousX || x).insertBefore(inserted)
    }
    else if (hierarchyPosition === 'after') {
      (previousX || x).insertAfter(inserted)
    }
    else if (hierarchyPosition === 'within') {
      (previousX || x).node.children.push(inserted)
    }
    else if (previousX && hierarchyPosition === 'children') {
      previousX.node.children.push(inserted)
    }
  }

  const postTraverse = createAddMissingImportsPostTraversal(fileNode, componentNode)

  const ast = updateComponentHierarchy(fileNode, reducedHierarchyIds, mutate, postTraverse)

  let { code } = generate(ast)

  code = await lintCode(code)

  fs.writeFileSync(fileNode.payload.path, code, 'utf-8')

  return fileNode.payload
}

export default addComponent
