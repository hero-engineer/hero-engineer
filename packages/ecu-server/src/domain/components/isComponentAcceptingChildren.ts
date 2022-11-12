import { FunctionNodeType } from '../../types'

import { getNodeByAddress, getNodesBySecondNeighbourg } from '../../graph'
import traverseTypes from '../types/traverseTypes'

function isComponentAcceptingChildren(componentAddress: string) {
  const componentNode = getNodeByAddress<FunctionNodeType>(componentAddress)

  if (!componentNode) {
    throw new Error(`Component with id ${componentAddress} not found`)
  }

  const fileNode = getNodesBySecondNeighbourg(componentAddress, 'DeclaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for component with id ${componentAddress} not found`)
  }

  const types = traverseTypes(fileNode)
  const componentPropsTypesIdentifier = `${componentNode.payload.name}PropsType`
  const type = types.find(type => type.name === componentPropsTypesIdentifier)

  return type && type.declaration.includes('PropsWithChildren') // HACK
}

export default isComponentAcceptingChildren
