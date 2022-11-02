import getComponentHierarchy from '../../domain/traversal/getComponentHierarchy'
import getComponentRootLimitedIds from '../../domain/traversal/getComponentRootLimitedIds'

type GetComponentArgs = {
  sourceComponentAddress: string
  hierarchyIds: string[]
}

function getHierarchy(_: any, { sourceComponentAddress, hierarchyIds }: GetComponentArgs) {
  console.log('__getHierarchy__')

  const hierarchy = getComponentHierarchy(sourceComponentAddress, hierarchyIds)

  const lastComponentAddress = [...hierarchy].reverse().find(x => x.componentAddress)?.componentAddress

  if (!lastComponentAddress) {
    return {
      hierarchy,
      componentRootLimitedIds: [],
    }
  }

  const componentRootLimitedIds = getComponentRootLimitedIds(lastComponentAddress)

  return {
    hierarchy,
    componentRootLimitedIds,
  }
}

export default getHierarchy
