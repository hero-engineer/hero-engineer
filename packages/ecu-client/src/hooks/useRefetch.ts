import { useContext, useEffect } from 'react'

import RefetchContext from '../contexts/RefetchContext'

function useRefetch(...args: (string | (() => void))[]) {
  if (args.length % 2 !== 0) {
    throw new Error('useRefetch requires an even number of arguments.')
  }

  const { refetch, register } = useContext(RefetchContext)

  useEffect(() => {
    const unregister: (() => void)[] = []

    for (let i = 0; i < args.length; i += 2) {
      unregister.push(register(args[i] as string, args[i + 1] as () => void))
    }

    return () => {
      unregister.forEach(unregister => unregister())
    }
  }, [register, args])

  return refetch
}

export default useRefetch
