import fs from 'fs'

import generate from '@babel/generator'

import { FileNodeType } from '../../types'

import graph from '../../graph'
import { getNodesBySecondNeighbourg } from '../../graph/helpers'

import keepLastComponentOfHierarchy from '../../domain/keepLastComponentOfHierarchyIds'
import updateComponentHierarchy from '../../domain/updateComponentHierarchy'
import createRemoveUnusedImportsPostTraversal from '../../domain/createRemoveUnusedImportsPostTraversal'
import lintCode from '../../domain/lintCode'

type DeleteComponentArgs = {
  hierarchyIds: string[]
}

async function deleteComponent(_: any, { hierarchyIds }: DeleteComponentArgs) {
  console.log('___deleteComponent___')

  const reducedHierarchyIds = keepLastComponentOfHierarchy(hierarchyIds, 2)
  const [functionNodeId] = reducedHierarchyIds[0].split(':')

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, functionNodeId, 'declaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${functionNodeId} not found`)
  }

  function mutate(x: any, previousX: any) {
    (previousX || x).remove()
  }

  const postTraverse = createRemoveUnusedImportsPostTraversal()

  const ast = updateComponentHierarchy(fileNode, reducedHierarchyIds, mutate, postTraverse)

  let { code } = generate(ast)

  code = await lintCode(code)

  fs.writeFileSync(fileNode.payload.path, code, 'utf-8')

  return fileNode.payload

}

export default deleteComponent
