import { HierarchyType } from '~types'

function findHierarchy(hierarchy: HierarchyType | null, targetId: string): HierarchyType | null {
  if (!hierarchy) return null
  if (hierarchy.id === targetId) return hierarchy

  return hierarchy.children.map(h => findHierarchy(h, targetId)).find(x => x) ?? null
}

export default findHierarchy
