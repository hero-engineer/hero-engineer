import { ViteHotContext } from 'vite/types/hot'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { Provider as GraphqlProvider } from 'urql'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { LogsType, SnackBarItemType, TabType, WarningsType } from '~types'

import ModeContext from '~contexts/ModeContext'
import HotContext from '~contexts/HotContext'
import LogsContext, { LogsContextType } from '~contexts/LogsContext'
import WarningContext, { WarningsContextType } from '~contexts/WarningsContext'
import RefetchContext, { RefetchContextType } from '~contexts/RefetchContext'
import ThemeModeContext, { ThemeModeContextType } from '~contexts/ThemeModeContext'
import SnackBarContext, { SnackBarContextType } from '~contexts/SnackBarContext'
import TabsContext, { TabsContextType } from '~contexts/TabsContext'

import useCreateRefetchRegistry from '~hooks/useCreateRefetchRegistry'
import usePersistedState from '~hooks/usePersistedState'

import client from '../../client'

type ProviderMasterPropsType = {
  mode: string
  hot: ViteHotContext | null
  children: ReactNode
}

// The providers for the whole application
function ProviderMaster({ mode, hot, children }: ProviderMasterPropsType) {
  const [logs, setLogs] = usePersistedState<LogsType>('logs', { typescript: false, css: false })
  const logsContextValue = useMemo<LogsContextType>(() => ({ logs, setLogs }), [logs, setLogs])

  const [warnings, setWarnings] = usePersistedState<WarningsType>('warnings', { cssClassOrdering: true })
  const warningsContextValue = useMemo<WarningsContextType>(() => ({ warnings, setWarnings }), [warnings, setWarnings])

  const { refetch, register } = useCreateRefetchRegistry()
  const refetchContextValue = useMemo<RefetchContextType>(() => ({ refetch, register }), [refetch, register])

  const [themeMode, setThemeMode] = usePersistedState<'light' | 'dark'>('theme-mode', 'dark')
  const themeModeContextValue = useMemo<ThemeModeContextType>(() => ({ themeMode, setThemeMode }), [themeMode, setThemeMode])

  const [snackBarItems, setSnackBarItems] = useState<SnackBarItemType[]>([])
  const appendSnackBarItem = useCallback((item: SnackBarItemType) => setSnackBarItems(x => [...x, item]), [])
  const snackBarContextValue = useMemo<SnackBarContextType>(() => ({ snackBarItems, setSnackBarItems, appendSnackBarItem }), [snackBarItems, appendSnackBarItem])

  const [tabs, setTabs] = usePersistedState<TabType[]>('tabs', [])
  const tabsContextValue = useMemo<TabsContextType>(() => ({ tabs, setTabs }), [tabs, setTabs])

  return (
    <GraphqlProvider value={client}>
      <DndProvider backend={HTML5Backend}>
        <ModeContext.Provider value={mode}>
          <HotContext.Provider value={hot}>
            <LogsContext.Provider value={logsContextValue}>
              <WarningContext.Provider value={warningsContextValue}>
                <RefetchContext.Provider value={refetchContextValue}>
                  <ThemeModeContext.Provider value={themeModeContextValue}>
                    <SnackBarContext.Provider value={snackBarContextValue}>
                      <TabsContext.Provider value={tabsContextValue}>
                        {children}
                      </TabsContext.Provider>
                    </SnackBarContext.Provider>
                  </ThemeModeContext.Provider>
                </RefetchContext.Provider>
              </WarningContext.Provider>
            </LogsContext.Provider>
          </HotContext.Provider>
        </ModeContext.Provider>
      </DndProvider>
    </GraphqlProvider>
  )
}

export default ProviderMaster
