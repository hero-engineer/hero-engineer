import { ecuAcceptingChildrenComponentNames } from '../../configuration'

import isComponentAcceptingChildren from '../../domain/components/isComponentAcceptingChildren'

type IsComponentAcceptingChildrenQueryArgs = {
  sourceComponentAddress?: string
  ecuComponentName?: string
}

function isComponentAcceptingChildrenQuery(_: any, { sourceComponentAddress, ecuComponentName }: IsComponentAcceptingChildrenQueryArgs) {
  console.log('__isComponentAcceptingChildrenQuery__')

  if (sourceComponentAddress) {
    return isComponentAcceptingChildren(sourceComponentAddress)
  }

  if (!ecuComponentName) {
    throw new Error('sourceComponentAddress or ecuComponentName is required')
  }

  return ecuAcceptingChildrenComponentNames.includes(ecuComponentName)
}

export default isComponentAcceptingChildrenQuery
