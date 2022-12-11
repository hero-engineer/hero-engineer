import { useContext, useEffect } from 'react'

import { FilesQuery, FilesQueryDataType } from '~queries'

import { addTypescriptSourceFiles } from '~processors/typescript'
import { addCssSourceFiles } from '~processors/css'

import LogsContext from '~contexts/LogsContext'

import useQuery from '~hooks/useQuery'

function useProcessors() {
  const { logs } = useContext(LogsContext)

  const [filesQueryResult] = useQuery<FilesQueryDataType>({ query: FilesQuery })

  // TODO useRefetch

  useEffect(() => {
    if (!filesQueryResult.data?.files) return

    addTypescriptSourceFiles(filesQueryResult.data.files, logs.hierarchy)
    addCssSourceFiles(filesQueryResult.data.files, logs.hierarchy)
  }, [filesQueryResult.data, logs.hierarchy])
}

export default useProcessors
