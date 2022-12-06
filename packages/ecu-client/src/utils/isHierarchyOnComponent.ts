import { HierarchyItemType } from '@types'

// Tell if the current hierarchy is on a given component
function isHierarchyOnComponent(hierarchy: HierarchyItemType[], componentAddress: string) {
  return hierarchy[hierarchy.length - 1]?.onComponentAddress === componentAddress
}

export default isHierarchyOnComponent
