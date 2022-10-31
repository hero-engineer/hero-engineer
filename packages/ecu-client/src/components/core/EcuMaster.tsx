import '../../css/common.css'

import { PropsWithChildren, memo, useMemo, useState } from 'react'
import { Provider } from 'urql'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CssBaseline, ThemeProvider } from 'honorable'

import client from '../../client'
import theme from '../../theme'

import ModeContext from '../../contexts/ModeContext'
import HotContext from '../../contexts/HotContext'
import HierarchyIdsContext, { HierarchyIdsContextType } from '../../contexts/HierarchyIdsContext'
import DragAndDropContext, { DragAndDropContextType, DragAndDropType } from '../../contexts/DragAndDropContext'

import usePersistedState from '../../hooks/usePersistedState'

import Router from './Router'

type EcuMasterProps = PropsWithChildren<{
  mode?: string
  hot?: any
}>

function EcuMaster({ mode = 'production', hot = null, children }: EcuMasterProps) {
  const [hierarchyIds, setHierarchyIds] = usePersistedState<string[]>('ecu-hierarchyIds', [])
  const HierarchyIdsContextValue = useMemo<HierarchyIdsContextType>(() => ({ hierarchyIds, setHierarchyIds }), [hierarchyIds, setHierarchyIds])

  const [dragAndDrop, setDragAndDrop] = useState<DragAndDropType>({ sourceHierarchyIds: [], targetHierarchyIds: [] })
  const dragAndDropContextValue = useMemo<DragAndDropContextType>(() => ({ dragAndDrop, setDragAndDrop }), [dragAndDrop])

  return (
    <Provider value={client}>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ModeContext.Provider value={mode}>
            <HotContext.Provider value={hot}>
              <HierarchyIdsContext.Provider value={HierarchyIdsContextValue}>
                <DragAndDropContext.Provider value={dragAndDropContextValue}>
                  <Router>
                    {children}
                  </Router>
                </DragAndDropContext.Provider>
              </HierarchyIdsContext.Provider>
            </HotContext.Provider>
          </ModeContext.Provider>
        </ThemeProvider>
      </DndProvider>
    </Provider>
  )
}

export default memo(EcuMaster)
