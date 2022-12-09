import { useEffect } from 'react'

import { FilesQuery, FilesQueryDataType } from '~queries'

import { addTypescriptSourceFiles } from '~processors/typescript'
import { addCssSourceFiles } from '~processors/css'

import useQuery from '~hooks/useQuery'

function useProcessors() {
  const [filesQueryResult] = useQuery<FilesQueryDataType>({ query: FilesQuery })

  // TODO useRefetch

  useEffect(() => {
    if (!filesQueryResult.data?.files) return

    addTypescriptSourceFiles(filesQueryResult.data.files)
    addCssSourceFiles(filesQueryResult.data.files)
  }, [filesQueryResult.data])
}

export default useProcessors
