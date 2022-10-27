import fs from 'fs'

import generate from '@babel/generator'

import { FileNodeType, FunctionNodeType, GraphType } from '../types'

import { getNodesByRole, getNodesBySecondNeighbourg } from '../graph/helpers'

import createHierarchyIdsAndKeys from '../domain/createHierarchyIdsAndKeys'
import lintCode from '../domain/lintCode'

async function createHierachyIdsAndKeysWatcher(graph: GraphType) {
  const componentNodes = getNodesByRole<FunctionNodeType>(graph, 'Function').filter(node => node.payload.isComponent)

  await Promise.all(componentNodes.map(async componentNode => {
    const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, componentNode.address, 'declaresFunction')[0]

    if (!fileNode) return

    const { ast } = fileNode.payload

    createHierarchyIdsAndKeys(ast, componentNode)

    let { code } = generate(ast)

    code = await lintCode(code)

    fs.writeFileSync(fileNode.payload.path, code, 'utf-8')
  }))
}

export default createHierachyIdsAndKeysWatcher
