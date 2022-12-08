import { ViteHotContext } from 'vite/types/hot'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { Provider as GraphqlProvider } from 'urql'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { BreakpointType, SnackBarItemType, TabType } from '@types'

import ModeContext from '@contexts/ModeContext'
import HotContext from '@contexts/HotContext'
import RefetchContext, { RefetchContextType } from '@contexts/RefetchContext'
import ThemeModeContext, { ThemeModeContextType } from '@contexts/ThemeModeContext'
import SnackBarContext, { SnackBarContextType } from '@contexts/SnackBarContext'
import TabsContext, { TabsContextType } from '@contexts/TabsContext'
import BreakpointContext, { BreakpointContextType } from '@contexts/BreakpointContext'
import IsInteractiveModeContext, { IsInteractiveModeContextType } from '@contexts/IsInteractiveModeContext'

import useCreateRefetchRegistry from '@hooks/useCreateRefetchRegistry'
import usePersistedState from '@hooks/usePersistedState'

import client from '../../../client'

type MasterProvidersPropsType = {
  mode: string
  hot: ViteHotContext | null
  children: ReactNode
}

// The providers for the whole application
function ProviderMaster({ mode, hot, children }: MasterProvidersPropsType) {
  const { refetch, register } = useCreateRefetchRegistry()
  const refetchContextValue = useMemo<RefetchContextType>(() => ({ refetch, register }), [refetch, register])

  const [themeMode, setThemeMode] = usePersistedState<'light' | 'dark'>('theme-mode', 'dark')
  const themeModeContextValue = useMemo<ThemeModeContextType>(() => ({ themeMode, setThemeMode }), [themeMode, setThemeMode])

  const [snackBarItems, setSnackBarItems] = useState<SnackBarItemType[]>([])
  const appendSnackBarItem = useCallback((item: SnackBarItemType) => setSnackBarItems(x => [...x, item]), [])
  const snackBarContextValue = useMemo<SnackBarContextType>(() => ({ snackBarItems, setSnackBarItems, appendSnackBarItem }), [snackBarItems, appendSnackBarItem])

  const [tabs, setTabs] = usePersistedState<TabType[]>('tabs', [])
  const tabsContextValue = useMemo<TabsContextType>(() => ({ tabs, setTabs }), [tabs, setTabs])

  const [breakpoint, setBreakpoint] = usePersistedState<BreakpointType>('breakpoint', {
    id: 'Default',
    name: 'Default',
    base: 1232,
    min: 992,
    max: 1279,
    scale: 1,
    media: '',
  })
  const [breakpoints, setBreakpoints] = usePersistedState<BreakpointType[]>('breakpoints', [])
  const [width, setWidth] = usePersistedState<number>('width', 0, (x: any) => parseFloat(x))
  const [height, setHeight] = usePersistedState<number | '-'>('height', '-', (x: any) => {
    const n = parseFloat(x)

    return n === n ? n : x
  })
  const [isDragging, setIsDragging] = useState(false)
  const breakpointContextValue = useMemo<BreakpointContextType>(() => ({ breakpoint, setBreakpoint, breakpoints, setBreakpoints, width, setWidth, height, setHeight, isDragging, setIsDragging }), [breakpoint, setBreakpoint, breakpoints, setBreakpoints, width, setWidth, height, setHeight, isDragging])

  const [isInteractiveMode, setIsInteractiveMode] = useState(false)
  const isInteractiveModeContextValue = useMemo<IsInteractiveModeContextType>(() => ({ isInteractiveMode, setIsInteractiveMode }), [isInteractiveMode])

  return (
    <GraphqlProvider value={client}>
      <DndProvider backend={HTML5Backend}>
        <ModeContext.Provider value={mode}>
          <HotContext.Provider value={hot}>
            <RefetchContext.Provider value={refetchContextValue}>
              <ThemeModeContext.Provider value={themeModeContextValue}>
                <SnackBarContext.Provider value={snackBarContextValue}>
                  <TabsContext.Provider value={tabsContextValue}>
                    <BreakpointContext.Provider value={breakpointContextValue}>
                      <IsInteractiveModeContext.Provider value={isInteractiveModeContextValue}>
                        {children}
                      </IsInteractiveModeContext.Provider>
                    </BreakpointContext.Provider>
                  </TabsContext.Provider>
                </SnackBarContext.Provider>
              </ThemeModeContext.Provider>
            </RefetchContext.Provider>
          </HotContext.Provider>
        </ModeContext.Provider>
      </DndProvider>
    </GraphqlProvider>
  )
}

export default ProviderMaster
