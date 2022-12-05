import { DocumentNode } from 'graphql'
import { useCallback, useContext, useEffect, useState } from 'react'
import { AnyVariables, OperationContext, TypedDocumentNode, UseMutationResponse, useMutation as externalUseMutation } from 'urql'

import { refetchKeys } from '../constants'

import SnackbarContext from '../contexts/SnackBarContext'

import useRefetch from './useRefetch'

// Has two responsibilities:
// - Show a snackbar item when the mutation fails
// - Refetch the undo/redo metadata after the mutation succeeds
function useMutation<T, V extends AnyVariables = AnyVariables>(args: string | DocumentNode | TypedDocumentNode): UseMutationResponse<T, V> {
  const { snackBarItems, appendSnackBarItem } = useContext(SnackbarContext)
  const [id, setId] = useState(0)
  const [mutationData, mutate] = externalUseMutation<T, V>(args)

  const refetch = useRefetch()

  const handleMutation = useCallback(async (args: V, context?: Partial<OperationContext> | undefined) => {
    setId(Date.now())

    const retval = await mutate(args, context)

    refetch(refetchKeys.undoRedoMetadata)

    return retval
  }, [mutate, refetch])

  useEffect(() => {
    const { error } = mutationData

    if (!error) return
    if (snackBarItems.some(x => x.id === id)) return

    appendSnackBarItem({
      id,
      content: error.message,
      severity: 'error',
    })
  }, [mutationData, id, snackBarItems, appendSnackBarItem])

  return [mutationData, handleMutation]
}

export default useMutation
