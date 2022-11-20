import { useCallback, useRef } from 'react'

import { refetchKeys } from '../constants'

type RefetchType = (options?: any) => void

const refetchOptions = { requestPolicy: 'network-only' }

// Create a refetch registry to handle query refetching
function useCreateRefetchRegistry() {
  const registry = useRef<Record<string, Record<number, RefetchType>>>({})

  const refetch = useCallback((key: string) => {
    if (key === refetchKeys.all) {
      Object.keys(registry).forEach(key => refetch(key))

      return
    }

    Object.values(registry.current[key] || {}).forEach(refetch => refetch(refetchOptions))
  }, [])

  const register = useCallback((key: string, refetch: (options?: any) => void) => {
    if (!registry.current[key]) registry.current[key] = {}

    const index = Math.random()

    registry.current[key][index] = refetch

    return () => {
      delete registry.current[key][index]
    }
  }, [])

  return { refetch, register }
}

export default useCreateRefetchRegistry
