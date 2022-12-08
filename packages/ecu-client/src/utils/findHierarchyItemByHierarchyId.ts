import { HierarchyItemType } from '~types'

function findHierarchyItemByHierarchyId(rootHierarchyItem: HierarchyItemType | null, targetHierarchyId: string): HierarchyItemType | null {
  if (!rootHierarchyItem) return null
  if (rootHierarchyItem.hierarchyId === targetHierarchyId) return rootHierarchyItem

  for (const child of rootHierarchyItem.children) {
    const found = findHierarchyItemByHierarchyId(child, targetHierarchyId)

    if (found) return found
  }

  return null
}

export default findHierarchyItemByHierarchyId
