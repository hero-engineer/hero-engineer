import { useMemo, useRef, useState } from 'react'

function useThrottleAsynchronous(fn: (...args: any[]) => any, delay: number, ignoreFirstDelay = false) {
  const timeoutId = useRef<NodeJS.Timeout>()
  const accumulator = useRef<(() => void)[]>([])
  const [isFirtTrigger, setIsFirstTrigger] = useState(ignoreFirstDelay)

  return useMemo(() => (...args: Parameters<typeof fn>) => new Promise<ReturnType<typeof fn>>(resolve => {
    clearTimeout(timeoutId.current)

    accumulator.current.push(() => resolve({ hasResolved: false }))

    const execute = () => Promise.resolve(fn(...args)).then(value => {
      accumulator.current.pop()
      accumulator.current.forEach(fn => fn())
      accumulator.current.length = 0

      resolve({ hasResolved: true, value })
    })

    if (isFirtTrigger) {
      execute()
      setIsFirstTrigger(false)
    }
    else {
      timeoutId.current = setTimeout(execute, delay)
    }
  }), [fn, delay, isFirtTrigger])
}

export default useThrottleAsynchronous
