import fs from 'fs'

import generate from '@babel/generator'

import { FileNodeType } from '../../types'

import graph from '../../graph'
import { getNodesBySecondNeighbourg } from '../../graph/helpers'

import updateComponentHierarchy from '../../domain/updateComponentHierarchy'
import createRemoveUnusedImportsPostTraversal from '../../domain/createRemoveUnusedImportsPostTraversal'
import lintCode from '../../domain/lintCode'

type DeleteComponentArgs = {
  hierarchyIds: string[]
}

async function deleteComponent(_: any, { hierarchyIds }: DeleteComponentArgs) {
  console.log('___deleteComponent___')

  // const reducedHierarchyIds = keepLastComponentOfHierarchy(hierarchyIds, 2)
  const [functionNodeId] = hierarchyIds[0].split(':')

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, functionNodeId, 'declaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${functionNodeId} not found`)
  }

  function mutate(x: any, previousX: any) {
    (previousX || x).remove()
  }

  const postTraverse = createRemoveUnusedImportsPostTraversal()

  const impacted = updateComponentHierarchy(fileNode, hierarchyIds, mutate, postTraverse)

  await Promise.all(impacted.map(async ({ fileNode, ast }) => {
    console.log('impacted:', fileNode.payload.name)

    let { code } = generate(ast)

    code = await lintCode(code)

    fs.writeFileSync(fileNode.payload.path, code, 'utf-8')
  }))

  return { id: 0 }
}

export default deleteComponent
