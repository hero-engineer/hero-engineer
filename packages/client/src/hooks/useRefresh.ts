import { useEffect, useState } from 'react'

function useRefresh(deps: any[] = []) {
  const [, setRefresh] = useState(false)

  useEffect(() => {
    setRefresh(x => !x)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default useRefresh
