import { useContext, useEffect, useMemo, useState } from 'react'

import HotContext from '../contexts/HotContext'

type HierarchyRegistryType = Record<string, number>

function createHierarchyId(registry: HierarchyRegistryType, prefix: string) {
  console.log('registry', prefix, registry)

  if (!registry[prefix]) registry[prefix] = 0

  return `${prefix}:${registry[prefix]++}`
}

function createUseHierarchyId() {
  const registry: HierarchyRegistryType = {}

  return (id: string) => {
    const hot = useContext(HotContext)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
      if (hot) {
        hot.on('vite:beforeUpdate', () => {
          console.log('deleting registry', id)
          delete registry[id]
          setRefresh(x => !x)
        })
      }
    }, [hot, id])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => createHierarchyId(registry, id), [id, refresh])
  }
}

export default createUseHierarchyId()
