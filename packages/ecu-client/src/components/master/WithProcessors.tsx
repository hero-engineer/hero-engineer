import { ReactNode, useContext, useEffect } from 'react'

import { FilesQuery, FilesQueryDataType } from '~queries'

import { addTypescriptSourceFiles } from '~processors/typescript'
import { addCssSourceFiles } from '~processors/css'

import LogsContext from '~contexts/LogsContext'

import useQuery from '~hooks/useQuery'

type WithProcessorsPropsType = {
  children: ReactNode
}

function WithProcessors({ children }: WithProcessorsPropsType) {
  const { logs } = useContext(LogsContext)

  const [filesQueryResult] = useQuery<FilesQueryDataType>({ query: FilesQuery })

  // TODO useRefetch

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
