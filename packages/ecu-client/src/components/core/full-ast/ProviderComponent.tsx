import { ReactNode, useMemo, useState } from 'react'

import { BreakpointType, TabType } from '~types'

import BreakpointContext, { BreakpointContextType } from '~contexts/BreakpointContext'
import IsInteractiveModeContext, { IsInteractiveModeContextType } from '~contexts/IsInteractiveModeContext'
import ComponentRemountContext, { ComponentRemountContextType } from '~contexts/ComponentRemountContext'
import BottomTabsContext, { BottomTabsContextType } from '~contexts/BottomTabsContext'

import usePersistedState from '~hooks/usePersistedState'

type ProviderComponentPropsType = {
  children: ReactNode
}

// The providers for the component scene
function ProviderComponent({ children }: ProviderComponentPropsType) {
  const [key, setKey] = useState(0)
  const componentRemountContextValue = useMemo<ComponentRemountContextType>(() => ({ key, setKey }), [key])

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
  const [height, setHeight] = usePersistedState<number | null>('height', null, (x: any) => {
    const n = parseFloat(x)

    return n === n ? n : x
  })
  const [isDragging, setIsDragging] = useState(false)
  const breakpointContextValue = useMemo<BreakpointContextType>(() => ({ breakpoint, setBreakpoint, breakpoints, setBreakpoints, width, setWidth, height, setHeight, isDragging, setIsDragging }), [breakpoint, setBreakpoint, breakpoints, setBreakpoints, width, setWidth, height, setHeight, isDragging])

  const [isInteractiveMode, setIsInteractiveMode] = usePersistedState('interactive-mode', false)
  const isInteractiveModeContextValue = useMemo<IsInteractiveModeContextType>(() => ({ isInteractiveMode, setIsInteractiveMode }), [isInteractiveMode, setIsInteractiveMode])

  const [tabs, setTabs] = usePersistedState<TabType[]>('bottom-tabs', [])
  const [currentTabIndex, setCurrentTabIndex] = usePersistedState('bottom-tabs-index', -1)
  const bottomTabsContext = useMemo<BottomTabsContextType>(() => ({ tabs, setTabs, currentTabIndex, setCurrentTabIndex }), [tabs, setTabs, currentTabIndex, setCurrentTabIndex])

  return (
    <ComponentRemountContext.Provider value={componentRemountContextValue}>
      <BreakpointContext.Provider value={breakpointContextValue}>
        <IsInteractiveModeContext.Provider value={isInteractiveModeContextValue}>
          <BottomTabsContext.Provider value={bottomTabsContext}>
            {children}
          </BottomTabsContext.Provider>
        </IsInteractiveModeContext.Provider>
      </BreakpointContext.Provider>
    </ComponentRemountContext.Provider>
  )
}

export default ProviderComponent
