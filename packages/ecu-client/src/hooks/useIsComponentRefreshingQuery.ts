import { useContext, useEffect } from 'react'
import { AnyVariables, UseQueryResponse } from 'urql'

import IsComponentRefreshingContext from '../contexts/IsComponentRefreshingContext'

function useIsComponentRefreshingQuery<T, V extends AnyVariables = AnyVariables>(query: UseQueryResponse<T, V>) {
  const { setIsComponentRefreshing } = useContext(IsComponentRefreshingContext)

  const [result] = query

  useEffect(() => {
    setIsComponentRefreshing(result.fetching)
  }, [result, setIsComponentRefreshing])

  return query
}

export default useIsComponentRefreshingQuery
