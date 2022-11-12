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
import HierarchyContext, { HierarchyContextType } from '../../contexts/HierarchyContext'
import DragAndDropContext, { DragAndDropContextType, DragAndDropType } from '../../contexts/DragAndDropContext'

import { HierarchyItemType } from '../../types'

import Router from './Router'
import WithEcuHomeButton from './WithEcuHomeButton'

type EcuMasterProps = PropsWithChildren<{
  mode?: string
  hot?: any
}>

function EcuMaster({ mode = 'production', hot = null, children }: EcuMasterProps) {
  const [hierarchy, setHierarchy] = useState<HierarchyItemType[]>([])
  const [totalHierarchy, setTotalHierarchy] = useState<HierarchyItemType[]>([])
  const [shouldAdjustComponentDelta, setShouldAdjustComponentDelta] = useState(false)
  const HierarchyContextValue = useMemo<HierarchyContextType>(() => ({ hierarchy, setHierarchy, totalHierarchy, setTotalHierarchy, shouldAdjustComponentDelta, setShouldAdjustComponentDelta }), [hierarchy, totalHierarchy, shouldAdjustComponentDelta])

  const [dragAndDrop, setDragAndDrop] = useState<DragAndDropType>({ sourceHierarchyIds: [], targetHierarchyIds: [] })
  const dragAndDropContextValue = useMemo<DragAndDropContextType>(() => ({ dragAndDrop, setDragAndDrop }), [dragAndDrop])

  return (
    <Provider value={client}>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ModeContext.Provider value={mode}>
            <HotContext.Provider value={hot}>
              <HierarchyContext.Provider value={HierarchyContextValue}>
                <DragAndDropContext.Provider value={dragAndDropContextValue}>
                  <Router>
                    <WithEcuHomeButton>
                      {children}
                    </WithEcuHomeButton>
                  </Router>
                </DragAndDropContext.Provider>
              </HierarchyContext.Provider>
            </HotContext.Provider>
          </ModeContext.Provider>
        </ThemeProvider>
      </DndProvider>
    </Provider>
  )
}

export default memo(EcuMaster)
