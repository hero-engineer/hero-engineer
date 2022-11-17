import '../../css/common.css'

import { ViteHotContext } from 'vite/types/hot'
import { PropsWithChildren, memo, useMemo, useState } from 'react'
import { Provider } from 'urql'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CssBaseline, ThemeProvider } from 'honorable'

import client from '../../client'
import theme from '../../theme'

import ModeContext from '../../contexts/ModeContext'
import HotContext from '../../contexts/HotContext'
import RefetchContext, { RefetchContextType } from '../../contexts/RefetchContext'
import HierarchyContext, { HierarchyContextType } from '../../contexts/HierarchyContext'
import DragAndDropContext, { DragAndDropContextType, DragAndDropType } from '../../contexts/DragAndDropContext'

import { HierarchyItemType } from '../../types'

import createRefetchRegistry from '../../helpers/createRefetchRegistry'

import Router from './Router'
import WithEcuHomeButton from './WithEcuHomeButton'

type EcuMasterPropsType = PropsWithChildren<{
  mode?: string
  hot?: ViteHotContext | null
}>

function EcuMaster({ mode = 'production', hot = null, children }: EcuMasterPropsType) {
  const { refetch, register } = createRefetchRegistry()
  const refetchContextValue = useMemo<RefetchContextType>(() => ({ refetch, register }), [refetch, register])

  const [hierarchy, setHierarchy] = useState<HierarchyItemType[]>([])
  const [totalHierarchy, setTotalHierarchy] = useState<HierarchyItemType[]>([])
  const [shouldAdjustComponentDelta, setShouldAdjustComponentDelta] = useState(false)
  const hierarchyContextValue = useMemo<HierarchyContextType>(() => ({ hierarchy, setHierarchy, totalHierarchy, setTotalHierarchy, shouldAdjustComponentDelta, setShouldAdjustComponentDelta }), [hierarchy, totalHierarchy, shouldAdjustComponentDelta])

  const [dragAndDrop, setDragAndDrop] = useState<DragAndDropType>({ sourceHierarchyIds: [], targetHierarchyIds: [] })
  const dragAndDropContextValue = useMemo<DragAndDropContextType>(() => ({ dragAndDrop, setDragAndDrop }), [dragAndDrop])

  return (
    <Provider value={client}>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ModeContext.Provider value={mode}>
            <HotContext.Provider value={hot}>
              <RefetchContext.Provider value={refetchContextValue}>
                <HierarchyContext.Provider value={hierarchyContextValue}>
                  <DragAndDropContext.Provider value={dragAndDropContextValue}>
                    <Router>
                      <WithEcuHomeButton>
                        {children}
                      </WithEcuHomeButton>
                    </Router>
                  </DragAndDropContext.Provider>
                </HierarchyContext.Provider>
              </RefetchContext.Provider>
            </HotContext.Provider>
          </ModeContext.Provider>
        </ThemeProvider>
      </DndProvider>
    </Provider>
  )
}

export default memo(EcuMaster)
