import { useMemo, useRef } from 'react'

function useThrottleAsynchronous(fn: (...args: any[]) => any, delay: number) {
  const timeoutId = useRef<NodeJS.Timeout>()
  const accumulator = useRef<(() => void)[]>([])

  return useMemo(() => (...args: Parameters<typeof fn>) => new Promise<ReturnType<typeof fn>>(resolve => {
    clearTimeout(timeoutId.current)

    accumulator.current.push(() => resolve({ hasResolved: false }))

    const execute = () => Promise.resolve(fn(...args)).then(value => {
      accumulator.current.pop()
      accumulator.current.forEach(fn => fn())
      accumulator.current.length = 0

      resolve({ hasResolved: true, value })
    })

    timeoutId.current = setTimeout(execute, delay)
  }), [fn, delay])
}

export default useThrottleAsynchronous
