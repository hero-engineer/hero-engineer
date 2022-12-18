import { HierarchyType } from '~types'

import { hierarchyIdSeparator, hierarchyIndexSeparator } from '~processors/typescript/createHierarchy'

function findSimilarHierarchies(hierarchy: HierarchyType | null, targetId: string) {
  if (!hierarchy) return []
  if (hierarchy.id === targetId) return [hierarchy]

  const limitedTargetId = getLimitedHierarchyId(targetId)

  return findSimilarHierarchiesByLimitedId(hierarchy, limitedTargetId)
}

function findSimilarHierarchiesByLimitedId(hierarchy: HierarchyType | null, limitedTargetId: string): HierarchyType[] {
  if (!hierarchy) return []

  const limitedId = getLimitedHierarchyId(hierarchy.id)

  if (limitedId === limitedTargetId) return [hierarchy]

  return hierarchy.children.map(h => findSimilarHierarchiesByLimitedId(h, limitedTargetId)).flat()
}

const limitedHierarchyRegex = new RegExp(`${hierarchyIdSeparator}([a-zA-Z0-9_]+)${hierarchyIndexSeparator}[0-9]+${hierarchyIdSeparator}([a-zA-Z0-9_]+${hierarchyIndexSeparator}[0-9]+)$`)

function getLimitedHierarchyId(id: string) {
  const match = limitedHierarchyRegex.exec(id)

  if (!match) return id

  return match[1] + match[2] // Function name + limited id
}

export default findSimilarHierarchies
