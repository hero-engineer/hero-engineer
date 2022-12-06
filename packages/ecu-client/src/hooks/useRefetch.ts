import { useContext, useEffect } from 'react'

import RefetchContext from '@contexts/RefetchContext'

type RefetchArgType = {
  key: string
  refetch: (options?: any) => void
  skip?: boolean
}

// Register a refetch function to the refetch registry
// Return the refetch function from context
function useRefetch(...args: RefetchArgType[]) {
  const { refetch, register } = useContext(RefetchContext)

  useEffect(() => {
    const unregister: (() => void)[] = []

    for (const { key, refetch, skip } of args) {
      if (skip) continue

      unregister.push(register(key, refetch))
    }

    return () => {
      unregister.forEach(unregister => unregister())
    }
  }, [register, args])

  return refetch
}

export default useRefetch
