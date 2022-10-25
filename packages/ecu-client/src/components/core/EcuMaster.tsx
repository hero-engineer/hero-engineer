import { PropsWithChildren, memo, useMemo } from 'react'
import { Provider } from 'urql'
import useLocalStorageState from 'use-local-storage-state'

import client from '../../client'

import ModeContext from '../../contexts/ModeContext'
import EditionContext, { EditionContextType } from '../../contexts/EditionContext'

import Router from './Router'
import Overlay from './Overlay'

type EcuMasterProps = PropsWithChildren<{
  mode?: string
}>

function EcuMaster({ mode = 'production' }: EcuMasterProps) {
  const [hierarchyIds, setHierarchyIds] = useLocalStorageState<string[]>('ecu-hierarchyIds', { defaultValue: [] })
  const editionContextValue = useMemo<EditionContextType>(() => ({ hierarchyIds, setHierarchyIds }), [hierarchyIds, setHierarchyIds])

  return (
    <Provider value={client}>
      <ModeContext.Provider value={mode}>
        <EditionContext.Provider value={editionContextValue}>
          <Router>
            <Overlay />
          </Router>
        </EditionContext.Provider>
      </ModeContext.Provider>
    </Provider>
  )
}

export default memo(EcuMaster)
