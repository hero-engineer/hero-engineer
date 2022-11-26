import { FunctionNodeType } from '../../types.js'

import { getNodeByAddress, getNodesBySecondNeighbourg } from '../../graph/index.js'

import isComponentAcceptingChildren from '../../domain/components/isComponentAcceptingChildren.js'
import getComponentDecoratorPaths from '../../domain/components/getComponentDecoratorPaths.js'

type ComponentQueryArgsType = {
  sourceComponentAddress: string
}

function componentQuery(_: any, { sourceComponentAddress }: ComponentQueryArgsType) {
  console.log('__componentQuery__')

  const componentNode = getNodeByAddress<FunctionNodeType>(sourceComponentAddress)

  if (!componentNode) {
    throw new Error(`Component with id ${sourceComponentAddress} not found`)
  }

  const fileNode = getNodesBySecondNeighbourg(sourceComponentAddress, 'DeclaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for component with id ${sourceComponentAddress} not found`)
  }

  return {
    component: componentNode,
    file: fileNode,
    decoratorPaths: getComponentDecoratorPaths(componentNode),
    isComponentAcceptingChildren: isComponentAcceptingChildren(componentNode.address),
  }
}

export default componentQuery
