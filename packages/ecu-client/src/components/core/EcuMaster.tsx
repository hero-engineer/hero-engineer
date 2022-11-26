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
import RefetchContext, { RefetchContextType } from '../../contexts/RefetchContext'
import SnackBarContext, { SnackBarContextType } from '../../contexts/SnackBarContext'
import IsComponentRefreshingContext, { IsComponentRefreshingContextType } from '../../contexts/IsComponentRefreshingContext'
import HierarchyContext, { HierarchyContextType } from '../../contexts/HierarchyContext'
import BreakpointContext, { BreakpointContextType } from '../../contexts/BreakpointContext'
import DragAndDropContext, { DragAndDropContextType, DragAndDropType } from '../../contexts/DragAndDropContext'
import ContextualInformationContext, { ContextualInformationContextType, ContextualInformationStateType } from '../../contexts/ContextualInformationContext'
import CssClassesContext, { CssClassesContextType } from '../../contexts/CssClassesContext'

import { BreakpointType, HierarchyItemType, SnackBarItemType } from '../../types'

import useCreateRefetchRegistry from '../../hooks/useCreateRefetchRegistry'
import usePersistedState from '../../hooks/usePersistedState'

import Router from './Router'
import WithEcuHomeButton from './WithEcuHomeButton'

type EcuMasterPropsType = PropsWithChildren<{
  mode?: string
  hot?: ViteHotContext | null
}>

// The master component that wraps the entire application
function EcuMaster({ mode = 'production', hot = null, children }: EcuMasterPropsType) {
  const { refetch, register } = useCreateRefetchRegistry()
  const refetchContextValue = useMemo<RefetchContextType>(() => ({ refetch, register }), [refetch, register])

  const [snackBarItems, setSnackBarItems] = useState<SnackBarItemType[]>([])
  const appendSnackBarItem = useCallback((item: SnackBarItemType) => setSnackBarItems(x => [...x, item]), [])
  const snackBarContextValue = useMemo<SnackBarContextType>(() => ({ snackBarItems, setSnackBarItems, appendSnackBarItem }), [snackBarItems, appendSnackBarItem])

  const [isComponentRefreshing, setIsComponentRefreshing] = useState(false)
  const isComponnentRefreshingContextValue = useMemo<IsComponentRefreshingContextType>(() => ({ isComponentRefreshing, setIsComponentRefreshing }), [isComponentRefreshing, setIsComponentRefreshing])

  const [hierarchy, setHierarchy] = useState<HierarchyItemType[]>([])
  const [totalHierarchy, setTotalHierarchy] = useState<HierarchyItemType| null>(null)
  const hierarchyContextValue = useMemo<HierarchyContextType>(() => ({ hierarchy, setHierarchy, totalHierarchy, setTotalHierarchy }), [hierarchy, totalHierarchy])

  const [breakpoint, setBreakpoint] = usePersistedState<BreakpointType | null>('ecu-breakpoint', null)
  const [breakpoints, setBreakpoints] = usePersistedState<BreakpointType[]>('ecu-breakpoints', [])
  const [width, setWidth] = usePersistedState<number>('ecu-width', 0, (x: any) => parseInt(x))
  const [isDragging, setIsDragging] = useState(false)
  const breakpointContextValue = useMemo<BreakpointContextType>(() => ({ breakpoint, setBreakpoint, breakpoints, setBreakpoints, width, setWidth, isDragging, setIsDragging }), [breakpoint, setBreakpoint, breakpoints, setBreakpoints, width, setWidth, isDragging])

  const [dragAndDrop, setDragAndDrop] = useState<DragAndDropType>({
    sourceHierarchyId: '',
    targetHierarchyId: '',
    sourceComponentDelta: 0,
    targetComponentDelta: 0,
  })
  const dragAndDropContextValue = useMemo<DragAndDropContextType>(() => ({ dragAndDrop, setDragAndDrop }), [dragAndDrop])

  const [contextualInformationState, setContextualInformationState] = useState<ContextualInformationStateType>({
    isEdited: false,
    isComponentRoot: false,
    rightClickEvent: null,
    element: null,
    dropElement: null,
  })
  const contextualInformationContextValue = useMemo<ContextualInformationContextType>(() => ({ contextualInformationState, setContextualInformationState }), [contextualInformationState])

  const [className, setClassName] = useState('')
  const [updatedClassName, setUpdatedClassName] = useState<string | null>(null)
  const cssClassesContextValue = useMemo<CssClassesContextType>(() => ({ className, setClassName, updatedClassName, setUpdatedClassName }), [className, updatedClassName])

  return (
    <Provider value={client}>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ModeContext.Provider value={mode}>
            <HotContext.Provider value={hot}>
              <RefetchContext.Provider value={refetchContextValue}>
                <SnackBarContext.Provider value={snackBarContextValue}>
                  <IsComponentRefreshingContext.Provider value={isComponnentRefreshingContextValue}>
                    <HierarchyContext.Provider value={hierarchyContextValue}>
                      <BreakpointContext.Provider value={breakpointContextValue}>
                        <DragAndDropContext.Provider value={dragAndDropContextValue}>
                          <ContextualInformationContext.Provider value={contextualInformationContextValue}>
                            <CssClassesContext.Provider value={cssClassesContextValue}>
                              <Router>
                                <WithEcuHomeButton>
                                  {children}
                                </WithEcuHomeButton>
                              </Router>
                            </CssClassesContext.Provider>
                          </ContextualInformationContext.Provider>
                        </DragAndDropContext.Provider>
                      </BreakpointContext.Provider>
                    </HierarchyContext.Provider>
                  </IsComponentRefreshingContext.Provider>
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
