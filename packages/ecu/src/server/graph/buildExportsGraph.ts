import traverse from '@babel/traverse'

import { FileType, FunctionType, GraphType } from '../../types'

import { filterByType } from './helpers'

function buildExportsGraph(graph: GraphType) {
  const files = filterByType<FileType>(graph, 'File')

  files.forEach(file => {
    traverse(file.ast, {
      ExportDeclaration(path) {
        const { type, declaration } = path.node as any
        let name

        switch (declaration.type) {
          case 'FunctionDeclaration': {
            name = declaration.id.name
            break
          }
          case 'Identifier': {
            name = declaration.name
            break
          }
          default: {
            // FIXME
            throw new Error(`Unsupported export type: ${declaration.type}`)
          }
        }

        const fn = graph.nodes[`Function:::${file.path}:::${name}`] as FunctionType

        if (fn) {
          fn.exportType = type === 'ExportDefaultDeclaration' ? 'default' : 'named'
        }
      },
    })
  })
}

export default buildExportsGraph
