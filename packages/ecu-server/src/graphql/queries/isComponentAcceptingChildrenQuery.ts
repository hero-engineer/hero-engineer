import isComponentAcceptingChildren from '../../domain/components/isComponentAcceptingChildren.js'

type IsComponentAcceptingChildrenQueryArgs = {
  sourceComponentAddress?: string
  ecuComponentName?: string
}

function isComponentAcceptingChildrenQuery(_: any, { sourceComponentAddress, ecuComponentName }: IsComponentAcceptingChildrenQueryArgs) {
  console.log('__isComponentAcceptingChildrenQuery__')

  return isComponentAcceptingChildren(sourceComponentAddress, ecuComponentName)
}

export default isComponentAcceptingChildrenQuery
