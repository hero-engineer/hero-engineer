import getComponentHierarchy from '../../domain/getComponentHierarchy'

type GetComponentArgs = {
  sourceComponentAddress: string
  hierarchyIds: string[]
}

function getHierarchy(_: any, { sourceComponentAddress, hierarchyIds }: GetComponentArgs) {
  return getComponentHierarchy(sourceComponentAddress, hierarchyIds)
}

export default getHierarchy
