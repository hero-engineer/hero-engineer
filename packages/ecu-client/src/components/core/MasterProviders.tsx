import { ViteHotContext } from 'vite/types/hot'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { Provider as GraphqlProvider } from 'urql'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import client from '../../client'

import ModeContext from '../../contexts/ModeContext'
import HotContext from '../../contexts/HotContext'
import RefetchContext, { RefetchContextType } from '../../contexts/RefetchContext'
import ThemeModeContext, { ThemeModeContextType } from '../../contexts/ThemeModeContext'
import SnackBarContext, { SnackBarContextType } from '../../contexts/SnackBarContext'
import LastEditedComponentContext, { LastEditedComponentContextType } from '../../contexts/LastEditedComponentContext'
import BreakpointContext, { BreakpointContextType } from '../../contexts/BreakpointContext'

import { BreakpointType, HierarchyItemType, SnackBarItemType } from '../../types'

import useCreateRefetchRegistry from '../../hooks/useCreateRefetchRegistry'
import usePersistedState from '../../hooks/usePersistedState'

type MasterProvidersPropsType = {
  mode: string
  hot: ViteHotContext | null
  children: ReactNode
}

// The providers for the whole application
function MasterProviders({ mode, hot, children }: MasterProvidersPropsType) {
  const { refetch, register } = useCreateRefetchRegistry()
  const refetchContextValue = useMemo<RefetchContextType>(() => ({ refetch, register }), [refetch, register])

  const [themeMode, setThemeMode] = usePersistedState<'light' | 'dark'>('theme-mode', 'dark')
  const themeModeContextValue = useMemo<ThemeModeContextType>(() => ({ themeMode, setThemeMode }), [themeMode, setThemeMode])

  const [snackBarItems, setSnackBarItems] = useState<SnackBarItemType[]>([])
  const appendSnackBarItem = useCallback((item: SnackBarItemType) => setSnackBarItems(x => [...x, item]), [])
  const snackBarContextValue = useMemo<SnackBarContextType>(() => ({ snackBarItems, setSnackBarItems, appendSnackBarItem }), [snackBarItems, appendSnackBarItem])

  const [lastEditedComponent, setLastEditedComponent] = usePersistedState<HierarchyItemType | null>('last-edited-component', null)
  const lastEditedComponentContextValue = useMemo<LastEditedComponentContextType>(() => ({ lastEditedComponent, setLastEditedComponent }), [lastEditedComponent, setLastEditedComponent])

  const [breakpoint, setBreakpoint] = usePersistedState<BreakpointType | null>('breakpoint', null)
  const [breakpoints, setBreakpoints] = usePersistedState<BreakpointType[]>('breakpoints', [])
  const [width, setWidth] = usePersistedState<number>('ecu-width', 0, (x: any) => parseInt(x))
  const [isDragging, setIsDragging] = useState(false)
  const breakpointContextValue = useMemo<BreakpointContextType>(() => ({ breakpoint, setBreakpoint, breakpoints, setBreakpoints, width, setWidth, isDragging, setIsDragging }), [breakpoint, setBreakpoint, breakpoints, setBreakpoints, width, setWidth, isDragging])

  return (
    <GraphqlProvider value={client}>
      <DndProvider backend={HTML5Backend}>
        <ModeContext.Provider value={mode}>
          <HotContext.Provider value={hot}>
            <RefetchContext.Provider value={refetchContextValue}>
              <ThemeModeContext.Provider value={themeModeContextValue}>
                <SnackBarContext.Provider value={snackBarContextValue}>
                  <LastEditedComponentContext.Provider value={lastEditedComponentContextValue}>
                    <BreakpointContext.Provider value={breakpointContextValue}>
                      {children}
                    </BreakpointContext.Provider>
                  </LastEditedComponentContext.Provider>
                </SnackBarContext.Provider>
              </ThemeModeContext.Provider>
            </RefetchContext.Provider>
          </HotContext.Provider>
        </ModeContext.Provider>
      </DndProvider>
    </GraphqlProvider>
  )
}

export default MasterProviders
