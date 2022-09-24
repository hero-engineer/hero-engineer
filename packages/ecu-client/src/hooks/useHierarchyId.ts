import { useMemo } from 'react'

const registry: Record<string, number> = {}

function createHierarchyId(prefix: string) {
  if (registry[prefix]) return `${prefix}_${registry[prefix]++}`

  registry[prefix] = 1

  return `${prefix}_0`
}

function useHierarchyId(id: string) {
  return useMemo(() => createHierarchyId(id), [id])
}

export default useHierarchyId
