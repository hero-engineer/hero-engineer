import fs from 'node:fs'
import path from 'node:path'

import { GraphType } from '../types.js'
import { ecuGraphFileName } from '../configuration.js'

import getHeroEngineerLocation from '../helpers/getHeroEngineerLocation.js'

import createFileNode from './models/createFileNode.js'
import createFunctionNode from './models/createFunctionNode.js'

function replacer(key: string, value: any) {
  if (key === 'ast' || key === 'code' || key === 'description' || key === 'emoji') {
    return null
  }

  return value
}

export function getGraph(): GraphType {
  const ecuLocation = getHeroEngineerLocation()
  const ecuGraphFileLocation = path.join(ecuLocation, ecuGraphFileName)

  if (!fs.existsSync(ecuGraphFileLocation)) {
    return {
      hash: '',
      nodes: {},
      edges: [],
    }
  }

  const ecuGraphFile = fs.readFileSync(ecuGraphFileLocation, 'utf8')
  const graph = JSON.parse(ecuGraphFile) as GraphType

  Object.entries(graph.nodes).forEach(([address, node]) => {
    if (node.role === 'File') graph.nodes[address] = createFileNode(node)
    if (node.role === 'Function') graph.nodes[address] = createFunctionNode(node)
  })

  return graph
}

export function setGraph(graph: GraphType) {
  const ecuLocation = getHeroEngineerLocation()
  const ecuGraphFileLocation = path.join(ecuLocation, ecuGraphFileName)

  fs.writeFileSync(ecuGraphFileLocation, JSON.stringify(graph, replacer, 2), 'utf8')
}
