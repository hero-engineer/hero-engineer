import { useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import EnvContext from '~contexts/EnvContext'

import { convertFromComponentPath } from '~utils/convertComponentPath'

function useCurrentComponentPath() {
  const { '*': ecuComponentPath = '' } = useParams()
  const env = useContext(EnvContext)

  return useMemo(() => ecuComponentPath ? `${env.VITE_CWD}/src/${convertFromComponentPath(ecuComponentPath)}` : '', [env.VITE_CWD, ecuComponentPath])
}

export default useCurrentComponentPath
