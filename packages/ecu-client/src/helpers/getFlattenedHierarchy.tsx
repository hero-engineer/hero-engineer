import { HierarchyItemType } from '../types'

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

function getFlattenedHierarchy(hierarchy: HierarchyItemType, hierarchyIds: string[]) {
  return bfs(hierarchy, hierarchyIds[hierarchyIds.length - 1])
}

export default getFlattenedHierarchy
