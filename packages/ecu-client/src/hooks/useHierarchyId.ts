import { useMemo } from 'react'

const registry: Record<string, number> = {}

function createHierarchyId(prefix: string) {
  if (!registry[prefix]) registry[prefix] = 0

  return `${prefix}_${registry[prefix]++}`
}

function useHierarchyId(id: string) {
  return useMemo(() => createHierarchyId(id), [id])
}

export default useHierarchyId
