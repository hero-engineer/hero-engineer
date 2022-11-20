import '../../css/common.css'

import { ViteHotContext } from 'vite/types/hot'
import { PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { Provider } from 'urql'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CssBaseline, ThemeProvider } from 'honorable'

import client from '../../client'
import theme from '../../theme'

import ModeContext from '../../contexts/ModeContext'
import HotContext from '../../contexts/HotContext'
import SnackBarContext, { SnackBarContextType } from '../../contexts/SnackBarContext'
import RefetchContext, { RefetchContextType } from '../../contexts/RefetchContext'
import HierarchyContext, { HierarchyContextType } from '../../contexts/HierarchyContext'
import DragAndDropContext, { DragAndDropContextType, DragAndDropType } from '../../contexts/DragAndDropContext'
import ContextualInformationContext, { ContextualInformationContextType, ContextualInformationStateType } from '../../contexts/ContextualInformationContext'

import { HierarchyItemType, SnackBarItemType } from '../../types'

import createRefetchRegistry from '../../helpers/createRefetchRegistry'

import Router from './Router'
import WithEcuHomeButton from './WithEcuHomeButton'

type EcuMasterPropsType = PropsWithChildren<{
  mode?: string
  hot?: ViteHotContext | null
}>

// The master component that wraps the entire application
function EcuMaster({ mode = 'production', hot = null, children }: EcuMasterPropsType) {
  const { refetch, register } = createRefetchRegistry()
  const refetchContextValue = useMemo<RefetchContextType>(() => ({ refetch, register }), [refetch, register])

  const [snackBarItems, setSnackBarItems] = useState<SnackBarItemType[]>([])
  const appendSnackBarItem = useCallback((item: SnackBarItemType) => setSnackBarItems(x => [...x, item]), [])
  const snackBarContextValue = useMemo<SnackBarContextType>(() => ({ snackBarItems, setSnackBarItems, appendSnackBarItem }), [snackBarItems, appendSnackBarItem])

  const [hierarchy, setHierarchy] = useState<HierarchyItemType[]>([])
  const [totalHierarchy, setTotalHierarchy] = useState<HierarchyItemType| null>(null)
  const [shouldAdjustComponentDelta, setShouldAdjustComponentDelta] = useState(false)
  const hierarchyContextValue = useMemo<HierarchyContextType>(() => ({ hierarchy, setHierarchy, totalHierarchy, setTotalHierarchy, shouldAdjustComponentDelta, setShouldAdjustComponentDelta }), [hierarchy, totalHierarchy, shouldAdjustComponentDelta])

  const [dragAndDrop, setDragAndDrop] = useState<DragAndDropType>({ sourceHierarchyIds: [], targetHierarchyIds: [] })
  const dragAndDropContextValue = useMemo<DragAndDropContextType>(() => ({ dragAndDrop, setDragAndDrop }), [dragAndDrop])

  const [contextualInformationElement, setContextualInformationElement] = useState<HTMLElement | null>(null)
  const [contextualInformationState, setContextualInformationState] = useState<ContextualInformationStateType>({ isEdited: false, isComponentRoot: false, rightClickEvent: null })
  const contextualInformationContextValue = useMemo<ContextualInformationContextType>(() => ({ contextualInformationElement, setContextualInformationElement, contextualInformationState, setContextualInformationState }), [contextualInformationElement, contextualInformationState])

  return (
    <Provider value={client}>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ModeContext.Provider value={mode}>
            <HotContext.Provider value={hot}>
              <RefetchContext.Provider value={refetchContextValue}>
                <SnackBarContext.Provider value={snackBarContextValue}>
                  <HierarchyContext.Provider value={hierarchyContextValue}>
                    <DragAndDropContext.Provider value={dragAndDropContextValue}>
                      <ContextualInformationContext.Provider value={contextualInformationContextValue}>
                        <Router>
                          <WithEcuHomeButton>
                            {children}
                          </WithEcuHomeButton>
                        </Router>
                      </ContextualInformationContext.Provider>
                    </DragAndDropContext.Provider>
                  </HierarchyContext.Provider>
                </SnackBarContext.Provider>
              </RefetchContext.Provider>
            </HotContext.Provider>
          </ModeContext.Provider>
        </ThemeProvider>
      </DndProvider>
    </Provider>
  )
}

export default EcuMaster
