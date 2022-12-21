import { useMemo } from 'react'

import { refetchKeys } from '~constants'

import { FilePathsQuery, FilePathsQueryDataType } from '~queries'

import useQuery from '~hooks/useQuery'
import useRefetch from '~hooks/useRefetch'

function useFilePaths() {
  const [filePathsQueryResult, refetchFilePathsQuery] = useQuery<FilePathsQueryDataType>({
    query: FilePathsQuery,
  })

  useRefetch({
    key: refetchKeys.filePaths,
    refetch: refetchFilePathsQuery,
  })

  return useMemo(() => filePathsQueryResult.data?.filePaths ?? [], [filePathsQueryResult.data])
}

export default useFilePaths
