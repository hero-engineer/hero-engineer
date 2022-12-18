import { useCallback, useEffect, useState } from 'react'

function useAsync<T>(memo: () => Promise<T>, deps: any[]) {
  const [result, setResult] = useState<T | null>(null)

  const resolve = useCallback(async () => {
    const result = await memo()

    setResult(result)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memo, ...deps])

  useEffect(() => {
    resolve()
  }, [resolve])

  return result
}

export default useAsync
