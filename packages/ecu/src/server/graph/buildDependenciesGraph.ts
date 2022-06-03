import path from 'path'

import { FileType, GraphType } from '../../types'

import { filterByType } from './helpers'

function buildDependenciesGraph(graph: GraphType) {
  const files = filterByType<FileType>(graph, 'File')

  files.forEach(file => {
    file.ast.program.body.forEach(node => {
      if (node.type === 'ImportDeclaration') {
        const { value } = node.source

        if (value.startsWith('.')) {
          const absolutePath = path.join(path.dirname(file.path), value)
          const dependency = graph.nodes[`File:::${absolutePath}.ts`] || graph.nodes[`File:::${absolutePath}.tsx`] || graph.nodes[`File:::${absolutePath}`]

          if (dependency) {
            graph.triplets.push([file.id, 'importsFile', dependency.id])
          }
        }
        else {
          graph.triplets.push([file.id, 'importsModule', `Module:::${value}`])
        }
      }
    })
  })
}

export default buildDependenciesGraph
