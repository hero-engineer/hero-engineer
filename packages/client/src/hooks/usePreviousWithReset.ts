import { useEffect, useRef, useState } from 'react'

// Use previous value hook with reset option
function usePreviousWithReset<T>(value: T, reset: boolean) {
  const ref = useRef<T>()
  const [, setRefresh] = useState(0)

  useEffect(() => {
    ref.current = value
  }, [value])

  useEffect(() => {
    if (!reset) return

    setRefresh(x => x + 1)
  }, [reset])

  return ref.current
}

export default usePreviousWithReset
