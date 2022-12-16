function createHierarchyId(limitedHierarchyId: string, index: number | string) {
  return `${limitedHierarchyId}:${index}`
}

export default createHierarchyId
