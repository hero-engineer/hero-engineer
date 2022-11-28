import { HierarchyItemType } from '../types'

// Get the root hierarchyIds for a hierarchy
function getComponentRootHierarchyIds(flattenedHierarchy: HierarchyItemType[]) {
  const componentRootHierarchyIds: string[] = []

  if (!flattenedHierarchy.length) {
    return componentRootHierarchyIds
  }

  const lastHierarchyItem = flattenedHierarchy[flattenedHierarchy.length - 1]

  if (lastHierarchyItem.hierarchyId) {
    return componentRootHierarchyIds
  }

  function traverseHierarchy(hierarchyItem: HierarchyItemType) {
    hierarchyItem.children?.forEach(child => {
      if (child.hierarchyId) {
        componentRootHierarchyIds.push(child.hierarchyId)

        return
      }

      traverseHierarchy(child)
    })
  }

  traverseHierarchy(lastHierarchyItem)

  // console.log('componentRootHierarchyIds', componentRootHierarchyIds)

  return componentRootHierarchyIds
}

export default getComponentRootHierarchyIds
