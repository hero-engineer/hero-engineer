import fs from 'node:fs'
import path from 'node:path'

import { GraphType } from '../types.js'
import { appPath, ecuGraphFileName, ecuRelativePath } from '../configuration.js'

import createFileNode from './models/createFileNode.js'
import createFunctionNode from './models/createFunctionNode.js'

function ensureEcuPathExistance() {
  const ecuPath = path.join(appPath, ecuRelativePath)

  if (!fs.existsSync(ecuPath)) {
    fs.mkdirSync(ecuPath, { recursive: true })
  }

  return ecuPath
}

function replacer(key: string, value: any) {
  if (key === 'ast' || key === 'code' || key === 'description' || key === 'emoji') {
    return null
  }

  return value
}

export function getGraph(): GraphType {
  const ecuPath = ensureEcuPathExistance()
  const ecuGraphFilePath = path.join(ecuPath, ecuGraphFileName)

  if (!fs.existsSync(ecuGraphFilePath)) {
    return {
      hash: '',
      nodes: {},
      edges: [],
    }
  }

  const ecuGraphFile = fs.readFileSync(ecuGraphFilePath, 'utf8')

  const graph = JSON.parse(ecuGraphFile) as GraphType

  Object.entries(graph.nodes).forEach(([key, value]) => {
    if (value.role === 'File') graph.nodes[key] = createFileNode(value)
    if (value.role === 'Function') graph.nodes[key] = createFunctionNode(value)
  })

  return graph
}

export function setGraph(graph: GraphType) {
  const ecuPath = ensureEcuPathExistance()
  const ecuGraphFilePath = path.join(ecuPath, ecuGraphFileName)

  fs.writeFileSync(ecuGraphFilePath, JSON.stringify(graph, replacer, 2), 'utf8')
}
