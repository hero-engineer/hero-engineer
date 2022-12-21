import { ReactNode } from 'react'

import FilePathsContext from '~contexts/FilePathsContext'

import useFilePaths from '~hooks/useFilePaths'

type ProviderFilePathsPropsType = {
  children: ReactNode
}

function ProviderFilePaths({ children }: ProviderFilePathsPropsType) {
  const filePaths = useFilePaths()

  return (
    <FilePathsContext.Provider value={filePaths}>
      {children}
    </FilePathsContext.Provider>
  )
}

export default ProviderFilePaths
