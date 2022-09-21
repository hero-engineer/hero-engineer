const registry: Record<string, number> = {}

function createHierarchyId(prefix: string) {
  if (registry[prefix]) return `${prefix}_${registry[prefix]++}`

  registry[prefix] = 1

  return `${prefix}_0`
}

export default createHierarchyId
