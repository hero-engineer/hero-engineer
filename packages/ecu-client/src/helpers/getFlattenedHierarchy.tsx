import { HierarchyItemType } from '../types'

function bfs(hierarchy: HierarchyItemType[], goalHierarchyId: string) {
  const queue = hierarchy.map(hierarchyItem => [hierarchyItem])

  while (queue.length) {
    // console.log('queue.length', queue.length)
    const path = queue.shift() as HierarchyItemType[]
    const hierarchyItem = path[path.length - 1]

    // console.log('hierarchyItem', hierarchyItem)
    if (hierarchyItem.hierarchyId === goalHierarchyId) {
      return path
    }

    hierarchyItem.children.forEach(hierarchyItem => {
      const nextPath = [...path]

      nextPath.push(hierarchyItem)
      queue.push(nextPath)
    })
  }

  return []
}

function getFlattenedHierarchy(hierarchy: HierarchyItemType[], hierarchyIds: string[]) {
  // const flattenedHierarchy: HierarchyItemType[] = []

  // flattenedHierarchy.push(...bfs(hierarchy, hierarchyId))
  // hierarchyIds.forEach(hierarchyId => {
  // })

  return bfs(hierarchy, hierarchyIds[hierarchyIds.length - 1])
}

export default getFlattenedHierarchy
