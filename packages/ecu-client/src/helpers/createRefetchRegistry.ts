import { refetchKeys } from '../constants'

// Create a refetch registry to handle query refetching
function createRefetchRegistry() {
  const registry: Record<string, Record<number, (options?: any) => void>> = {}

  function refetch(key: string) {
    if (key === refetchKeys.all) {
      Object.keys(registry).forEach(key => refetch(key))

      return
    }

    Object.values(registry[key] || {}).forEach(refetch => refetch({ requestPolicy: 'network-only' }))
  }

  function register(key: string, refetch: () => void) {
    if (!registry[key]) registry[key] = {}

    const index = Math.random()

    registry[key][index] = refetch

    return () => {
      delete registry[key][index]
    }
  }

  return { refetch, register }
}

export default createRefetchRegistry
