import { HierarchyItemType } from '~types'

// Get the last hierarchyItem with a componentName
function getLastEditedHierarchyItem(hierarchy: HierarchyItemType[]) {
  const reversedHierarchy = [...hierarchy].reverse()

  reversedHierarchy.shift()

  return reversedHierarchy.find(x => x.componentAddress)
}

export default getLastEditedHierarchyItem
