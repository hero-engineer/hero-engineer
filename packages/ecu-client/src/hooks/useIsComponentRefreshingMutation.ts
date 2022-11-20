import { useCallback, useContext } from 'react'
import { AnyVariables, OperationContext, UseMutationResponse } from 'urql'

import IsComponentRefreshingContext from '../contexts/IsComponentRefreshingContext'

function useIsComponentRefreshingMutation<T, V extends AnyVariables = AnyVariables>(mutation: UseMutationResponse<T, V>): UseMutationResponse<T, V> {
  const { setIsComponentRefreshing } = useContext(IsComponentRefreshingContext)

  const [result, mutate] = mutation

  const executeMutation = useCallback(async (variables: V, context?: Partial<OperationContext>) => {
    setIsComponentRefreshing(true)

    const retval = await mutate(variables, context)

    setIsComponentRefreshing(false)

    return retval
  }, [mutate, setIsComponentRefreshing])

  return [result, executeMutation]
}

export default useIsComponentRefreshingMutation
