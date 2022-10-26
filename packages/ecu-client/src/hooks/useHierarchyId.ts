import { useContext, useEffect, useMemo, useState } from 'react'

import HotContext from '../contexts/HotContext'

const registry: Record<string, number> = {}

function createHierarchyId(prefix: string) {
  if (!registry[prefix]) registry[prefix] = 0

  console.log('prefix, registry[prefix]', prefix, registry[prefix])

  return `${prefix}:${registry[prefix]++}`
}

function useHierarchyId(id: string) {
  const hot = useContext(HotContext)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (hot) {
      hot.on('vite:beforeUpdate', () => {
        console.log('delete id', id)
        delete registry[id]
        setRefresh(x => !x)
      })
    }
  }, [id, hot])

  if (id === 'RYplbhv0Mo:0') {
    console.log('refresh', refresh)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => createHierarchyId(id), [id, refresh])
}

export default useHierarchyId
