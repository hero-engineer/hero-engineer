import getComponentHierarchy from '../../domain/getComponentHierarchy'

type GetComponentArgs = {
  sourceComponentId: string
  hierarchyIds: string[]
}

function getHierarchy(_: any, { sourceComponentId, hierarchyIds }: GetComponentArgs) {
  return getComponentHierarchy(sourceComponentId, hierarchyIds)
}

export default getHierarchy
