import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { convertFromEcuComponentPath } from '~utils/convertComponentPath'

function useCurrentComponentPath() {
  const { '*': ecuComponentPath = '' } = useParams()

  return useMemo(() => ecuComponentPath ? `/Users/sven/dev/ecu-app/app/src/${convertFromEcuComponentPath(ecuComponentPath)}` : '', [ecuComponentPath])
}

export default useCurrentComponentPath
