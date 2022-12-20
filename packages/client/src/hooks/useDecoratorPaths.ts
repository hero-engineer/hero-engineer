import { useCallback, useContext } from 'react'

import getComponentDecoratorPaths from '~processors/typescript/getComponentDecoratorPaths'

import EnvContext from '~contexts/EnvContext'
import LogsContext from '~contexts/LogsContext'

import useAsync from '~hooks/useAsync'

function useDecoratorPaths(componentPath: string) {
  const env = useContext(EnvContext)
  const { logs } = useContext(LogsContext)

  const getComponentDecoratorsPathCallback = useCallback(() => getComponentDecoratorPaths(env.VITE_CWD, componentPath, logs.typescript), [env.VITE_CWD, componentPath, logs.typescript])

  return useAsync(getComponentDecoratorsPathCallback, [getComponentDecoratorsPathCallback])
}

export default useDecoratorPaths
