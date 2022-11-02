import { useEffect, useRef } from 'react'

function usePrevious<T>(value: T, defaultValue: T) {
  const ref = useRef<T>(defaultValue)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default usePrevious
