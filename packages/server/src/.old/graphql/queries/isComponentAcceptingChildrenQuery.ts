import isComponentAcceptingChildren from '../../domain/components/isComponentAcceptingChildren.js'

type IsComponentAcceptingChildrenQueryArgsType = {
  sourceComponentAddress?: string
  ecuComponentName?: string
}

function isComponentAcceptingChildrenQuery(_: any, { sourceComponentAddress, ecuComponentName }: IsComponentAcceptingChildrenQueryArgsType) {
  return isComponentAcceptingChildren(sourceComponentAddress, ecuComponentName)
}

export default isComponentAcceptingChildrenQuery
