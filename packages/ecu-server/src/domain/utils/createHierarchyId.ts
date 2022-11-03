function createHierarchyId(limitedHierarchyId: string, index: number) {
  return `${limitedHierarchyId}:${index}`
}

export default createHierarchyId
