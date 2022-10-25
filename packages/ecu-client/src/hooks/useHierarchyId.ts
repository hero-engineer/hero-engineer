import { useContext, useEffect, useMemo, useState } from 'react'

import HotContext from '../contexts/HotContext'

const registry: Record<string, number> = {}

function createHierarchyId(prefix: string) {
  if (!registry[prefix]) registry[prefix] = 0

  return `${prefix}:${registry[prefix]++}`
}

function useHierarchyId(id: string) {
  const hot = useContext(HotContext)
  // const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (hot) {
      hot.on('vite:beforeUpdate', () => {
        console.log('delete, id', id)
        delete registry[id]
        // setRefresh(x => !x)
      })
    }
  }, [id, hot])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => createHierarchyId(id), [id])
}

export default useHierarchyId
