import { HierarchyItemType } from '@types'

function getLastComponentHierarchyItem(hierarchy: HierarchyItemType[]) {
  return [...hierarchy].reverse().find(item => item.componentAddress)
}

export default getLastComponentHierarchyItem
