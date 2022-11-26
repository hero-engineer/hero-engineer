import { useEffect, useState } from 'react'

function useRefresh() {
  const [, setRefresh] = useState(false)

  useEffect(() => {
    setRefresh(x => !x)
  }, [])
}

export default useRefresh
