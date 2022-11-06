import { HierarchyItemType } from '../types'

function isHierarchyOnComponent(hierarchy: HierarchyItemType[], componentAddress: string) {
  return hierarchy[hierarchy.length - 1].onComponentAddress === componentAddress
}

export default isHierarchyOnComponent
