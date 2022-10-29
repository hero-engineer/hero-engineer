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
import EditionContext, { EditionContextType } from '../../contexts/EditionContext'
import DragAndDropContext, { DragAndDropContextType, DragAndDropType } from '../../contexts/DragAndDropContext'

import usePersistedState from '../../hooks/usePersistedState'

import Router from './Router'
import DragAndDropEndModal from './DragAndDropEndModal'

type EcuMasterProps = PropsWithChildren<{
  mode?: string
  hot?: any
}>

function EcuMaster({ mode = 'production', hot = null }: EcuMasterProps) {
  const [hierarchyIds, setHierarchyIds] = usePersistedState<string[]>('ecu-hierarchyIds', [])
  const editionContextValue = useMemo<EditionContextType>(() => ({ hierarchyIds, setHierarchyIds }), [hierarchyIds, setHierarchyIds])

  const [dragAndDrop, setDragAndDrop] = useState<DragAndDropType>({ sourceHierarchyIds: [], targetHierarchyIds: [] })
  const dragAndDropContextValue = useMemo<DragAndDropContextType>(() => ({ dragAndDrop, setDragAndDrop }), [dragAndDrop])

  return (
    <Provider value={client}>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ModeContext.Provider value={mode}>
            <HotContext.Provider value={hot}>
              <EditionContext.Provider value={editionContextValue}>
                <DragAndDropContext.Provider value={dragAndDropContextValue}>
                  <Router />
                  <DragAndDropEndModal />
                </DragAndDropContext.Provider>
              </EditionContext.Provider>
            </HotContext.Provider>
          </ModeContext.Provider>
        </ThemeProvider>
      </DndProvider>
    </Provider>
  )
}

export default memo(EcuMaster)
