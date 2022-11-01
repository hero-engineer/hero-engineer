import getComponentHierarchy from '../../domain/traversal/getComponentHierarchy'
import getComponentRootHierarchyIds from '../../domain/traversal/getComponentRootHierarchyIds'

type GetComponentArgs = {
  sourceComponentAddress: string
  hierarchyIds: string[]
}

function getHierarchy(_: any, { sourceComponentAddress, hierarchyIds }: GetComponentArgs) {
  console.log('__getHierarchy__')

  const hierarchy = getComponentHierarchy(sourceComponentAddress, hierarchyIds)

  const lastComponentAddress = [...hierarchy].reverse().find(x => x.componentAddress)?.componentAddress

  if (!lastComponentAddress) {
    throw new Error('Invalid hierarchy')
  }

  const componentRootHierarchyIds = getComponentRootHierarchyIds(lastComponentAddress)

  return {
    hierarchy,
    componentRootHierarchyIds,
  }
}

export default getHierarchy
