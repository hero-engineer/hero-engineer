import { FileType, GraphType } from '../../types'

import { filterByType } from './helpers'

function buildDependenciesGraph(graph: GraphType) {
  const files = filterByType<FileType>(graph, 'File')

  files.forEach(file => {
    file.ast.program.body.forEach(node => {
      if (node.type === 'ImportDeclaration') {
        const { source } = node
        const { value } = source

        graph.triplets.push([file.id, 'imports', value])
      }
    })
  })

  console.log('graph.triplets', graph.triplets)
}

export default buildDependenciesGraph
