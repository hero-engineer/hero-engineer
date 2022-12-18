import { useEffect, useRef } from 'react'

// Use previous value hook
// With default initial value
function usePreviousWithDefault<T>(value: T, defaultValue: T) {
  const ref = useRef<T>(defaultValue)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default usePreviousWithDefault
