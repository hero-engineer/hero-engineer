import { HierarchyItemType } from '../types'

function getComponentRootHierarchyIds(flattenedHierarchy: HierarchyItemType[]) {
  const componentRootHierarchyIds: string[] = []

  if (!flattenedHierarchy.length) {
    return componentRootHierarchyIds
  }

  const lastHierarchyItem = flattenedHierarchy[flattenedHierarchy.length - 1]

  // console.log('lastHierarchyItem', lastHierarchyItem)

  if (lastHierarchyItem.hierarchyId) {
    return componentRootHierarchyIds
  }

  function traverseHierarchy(hierarchyItem: HierarchyItemType) {
    // console.log('hierarchyItem.children', hierarchyItem.children)
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
