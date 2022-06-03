import traverse from '@babel/traverse'

import { FileType, FunctionType, GraphType } from '../../types'

import { filterByType } from './helpers'

function buildFunctionsGraph(graph: GraphType) {
  const files = filterByType<FileType>(graph, 'File')

  files.forEach(file => {
    traverse(file.ast, {
      FunctionDeclaration(path) {
        const fn: FunctionType = {
          id: `Function:::${file.path}:::${path.node.id.name}`,
          type: 'Function',
          name: path.node.id.name,
          isComponent: false,
          exportType: 'none',
          astPath: path,
        }

        graph.nodes[fn.id] = fn
        graph.triplets.push([file.id, 'hostsFunction', fn.id])
      },
    })
  })
}

export default buildFunctionsGraph
