import { FunctionNodeType } from '../../types.js'

import { getNodesByRole, getNodesBySecondNeighbourg } from '../../graph/index.js'

import isComponentAcceptingChildren from '../../domain/components/isComponentAcceptingChildren.js'
import getComponentDecoratorPaths from '../../domain/components/getComponentDecoratorPaths.js'

function componentsQuery() {
  console.log('__componentsQuery__')

  return getNodesByRole<FunctionNodeType>('Function').filter(node => node.payload.isComponent).map(componentNode => {
    const fileNode = getNodesBySecondNeighbourg(componentNode.address, 'DeclaresFunction')[0]

    if (!fileNode) {
      throw new Error(`File for component ${componentNode.address} not found`)
    }

    return {
      component: componentNode,
      file: fileNode,
      decoratorPaths: getComponentDecoratorPaths(componentNode),
      isComponentAcceptingChildren: isComponentAcceptingChildren(componentNode.address),
    }
  })
}

export default componentsQuery
