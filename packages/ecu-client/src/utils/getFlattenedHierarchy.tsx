import { HierarchyItemType } from '@types'

function bfs(hierarchy: HierarchyItemType, goalHierarchyId: string) {
  const queue = [[hierarchy]]

  while (queue.length) {
    const path = queue.shift() as HierarchyItemType[]
    const hierarchyItem = path[path.length - 1]

    if (hierarchyItem.hierarchyId === goalHierarchyId) {
      return path
    }

    hierarchyItem.children?.forEach(hierarchyItem => {
      const nextPath = [...path]

      nextPath.push(hierarchyItem)
      queue.push(nextPath)
    })
  }

  return []
}

// Flattens the hierarchy
function getFlattenedHierarchy(hierarchy: HierarchyItemType, hierarchyId: string) {
  return bfs(hierarchy, hierarchyId)
}

export default getFlattenedHierarchy
