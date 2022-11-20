import { DocumentNode } from 'graphql'
import { useCallback, useContext, useEffect, useState } from 'react'
import { TypedDocumentNode, useMutation as externalUseMutation } from 'urql'

import SnackbarContext from '../contexts/SnackBarContext'

function useMutation<T>(args: string | DocumentNode | TypedDocumentNode) {
  const { snackBarItems, setSnackBarItems } = useContext(SnackbarContext)
  const [id, setId] = useState(0)
  const [retval0, retval1] = externalUseMutation<T>(args)

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

  const handleMutation = useCallback((args: any) => {
    setId(Date.now())

    return retval1(args)
  }, [retval1])

  return [retval0, handleMutation]
}

export default useMutation
