import { HierarchyItemType } from '../types'

function getActualHierarchy(hierarchy: HierarchyItemType[], componentDelta: number) {
  return hierarchy.slice(0, hierarchy.length + componentDelta)
}

export default getActualHierarchy
