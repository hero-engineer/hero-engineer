import { FunctionNodeType } from '../../types.js'

import { ecuAtoms } from '../../configuration.js'

import { getNodeByAddress, getNodesBySecondNeighbourg } from '../../graph/index.js'

import traverseTypes from '../types/traverseTypes.js'

function isComponentAcceptingChildren(componentAddress?: string, ecuAtomName?: string) {
  if (ecuAtomName) {
    const ecuAtom = ecuAtoms.find(x => x.name === ecuAtomName)

    if (!ecuAtom) {
      throw new Error(`Ecu atom ${ecuAtomName} not found`)
    }

    return ecuAtom.isComponentAcceptingChildren
  }

  if (!componentAddress) {
    throw new Error('No componentAddress or ecuComponentName provided to isComponentAcceptingChildren')
  }

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

  return !!(type && type.declaration.includes('PropsWithChildren')) // HACK
}

export default isComponentAcceptingChildren
