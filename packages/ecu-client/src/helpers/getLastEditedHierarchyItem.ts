import { HierarchyItemType } from '../types'

function getLastEditedHierarchyItem(hierarchy: HierarchyItemType[]) {
  const reversedHierarchy = [...hierarchy].reverse()

  reversedHierarchy.shift()

  return reversedHierarchy.find(x => x.componentAddress)
}

export default getLastEditedHierarchyItem
