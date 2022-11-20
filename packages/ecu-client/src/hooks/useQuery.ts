import { useCallback, useContext, useEffect, useState } from 'react'
import { UseQueryArgs, useQuery as externalUseQuery } from 'urql'

import SnackbarContext from '../contexts/SnackBarContext'

function useQuery<T>(args: UseQueryArgs) {
  const { snackBarItems, setSnackBarItems } = useContext(SnackbarContext)
  const [id, setId] = useState(Math.random())
  const [retval0, retval1] = externalUseQuery<T>(args)

  useEffect(() => {
    const { error } = retval0

    if (!error) return
    if (snackBarItems.some(x => x.id === id)) return

    setSnackBarItems(x => [
      ...x,
      {
        id,
        content: error.message,
        severity: 'error',
      },
    ])
  }, [retval0, id, snackBarItems, setSnackBarItems])

  const handleRefetch = useCallback((args: any) => {
    setId(Date.now())

    return retval1(args)
  }, [retval1])

  return [retval0, handleRefetch]
}

export default useQuery
