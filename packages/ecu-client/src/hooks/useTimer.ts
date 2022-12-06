import { useCallback, useState } from 'react'

function useTimer(delay: number) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(undefined)

  const start = useCallback(() => {
    setTimeoutId(() => setTimeout(() => setIsCompleted(true), delay))
  }, [delay])

  const stop = useCallback(() => {
    clearTimeout(timeoutId)
    setIsCompleted(false)
  }, [timeoutId])

  return { isCompleted, start, stop }
}

export default useTimer
