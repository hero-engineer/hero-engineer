import { ReactNode, useContext, useEffect } from 'react'

import { refetchKeys } from '~constants'

import { FilesQuery, FilesQueryDataType } from '~queries'

import { addTypescriptSourceFiles } from '~processors/typescript'
import { addCssSourceFiles } from '~processors/css'

import LogsContext from '~contexts/LogsContext'

import useQuery from '~hooks/useQuery'
import useRefetch from '~hooks/useRefetch'

type WithProcessorsPropsType = {
  children: ReactNode
}

function WithProcessors({ children }: WithProcessorsPropsType) {
  const { logs } = useContext(LogsContext)

  const [filesQueryResult, refetchFilesQuery] = useQuery<FilesQueryDataType>({ query: FilesQuery })

  useRefetch({
    key: refetchKeys.files,
    refetch: refetchFilesQuery,
  })

  useEffect(() => {
    if (!filesQueryResult.data?.files) return

    addTypescriptSourceFiles(filesQueryResult.data.files, logs.typescript)
    addCssSourceFiles(filesQueryResult.data.files, logs.typescript)
  }, [filesQueryResult.data, logs.typescript])

  return (
    <>
      {children}
    </>
  )
}

export default WithProcessors
