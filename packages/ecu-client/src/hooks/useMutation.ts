import { DocumentNode } from 'graphql'
import { useCallback, useContext, useEffect, useState } from 'react'
import { AnyVariables, OperationContext, OperationResult, TypedDocumentNode, UseMutationState, useMutation as externalUseMutation } from 'urql'

import SnackbarContext from '../contexts/SnackBarContext'

type MutateType<T, V extends AnyVariables = AnyVariables> = (variables: V, context?: Partial<OperationContext>) => Promise<OperationResult<T, V>>

function useMutation<T>(args: string | DocumentNode | TypedDocumentNode): [UseMutationState<T>, MutateType<T>] {
  const { snackBarItems, appendSnackBarItem } = useContext(SnackbarContext)
  const [id, setId] = useState(0)
  const [retval0, retval1] = externalUseMutation<T>(args)

  useEffect(() => {
    const { error } = retval0

    if (!error) return
    if (snackBarItems.some(x => x.id === id)) return

    appendSnackBarItem({
      id,
      content: error.message,
      severity: 'error',
    })
  }, [retval0, id, snackBarItems, appendSnackBarItem])

  const handleMutation = useCallback((args: any) => {
    setId(Date.now())

    return retval1(args)
  }, [retval1])

  return [retval0, handleMutation]
}

export default useMutation
