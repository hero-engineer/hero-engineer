import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'

function usePersistedState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const getLocalStorageValue = useCallback(() => {
    try {
      const item = localStorage.getItem(key)

      if (item) return JSON.parse(item)
    }
    catch (error) {
      console.log('Error on localStorage.getItem of', key)
    }

    return defaultValue
  }, [key, defaultValue])

  const [state, setState] = useState<T>(getLocalStorageValue())

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

export default usePersistedState
