import { PropsWithChildren, memo, useMemo, useState } from 'react'
import { Provider } from 'urql'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import client from '../../client'

import ModeContext from '../../contexts/ModeContext'
import HotContext from '../../contexts/HotContext'
import EditionContext, { DragHierarchyPositionType, EditionContextType } from '../../contexts/EditionContext'

import usePersistedState from '../../hooks/usePersistedState'

import Router from './Router'

type EcuMasterProps = PropsWithChildren<{
  mode?: string
  hot?: any
}>

function EcuMaster({ mode = 'production', hot = null }: EcuMasterProps) {
  const [hierarchyIds, setHierarchyIds] = usePersistedState<string[]>('ecu-hierarchyIds', [])
  const [dragHierarchyPosition, setDragHierarchyPosition] = useState<DragHierarchyPositionType>(null)
  const editionContextValue = useMemo<EditionContextType>(() => ({ hierarchyIds, setHierarchyIds, dragHierarchyPosition, setDragHierarchyPosition }), [hierarchyIds, setHierarchyIds, dragHierarchyPosition])

  return (
    <Provider value={client}>
      <DndProvider backend={HTML5Backend}>
        <ModeContext.Provider value={mode}>
          <HotContext.Provider value={hot}>
            <EditionContext.Provider value={editionContextValue}>
              <Router />
            </EditionContext.Provider>
          </HotContext.Provider>
        </ModeContext.Provider>
      </DndProvider>
    </Provider>
  )
}

export default memo(EcuMaster)
