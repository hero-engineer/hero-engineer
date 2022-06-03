import traverse from '@babel/traverse'

import { FunctionType, GraphType } from '../../types'

import { filterByType } from './helpers'

function buildComponentsGraph(graph: GraphType) {
  const fns = filterByType<FunctionType>(graph, 'Function')

  fns.forEach(fn => {
    let isWithinReturnStatement = false

    traverse(fn.astPath.node, {
      ReturnStatement() {
        isWithinReturnStatement = true
      },
      JSXElement(path) {
        if (isWithinReturnStatement) {
          fn.isComponent = true

          path.stop()
        }
      },
    }, fn.astPath.scope, fn.astPath)
  })
}

export default buildComponentsGraph
