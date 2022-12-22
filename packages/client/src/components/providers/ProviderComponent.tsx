import { ReactNode, useMemo, useState } from 'react'

import { BreakpointType, HierarchyType } from '~types'

import HierarchyContext, { HierarchyContextType } from '~contexts/HierarchyContext'
import BreakpointContext, { BreakpointContextType } from '~contexts/BreakpointContext'
import BreakpointDimensionsContext, { BreakpointDimensionsContextType } from '~contexts/BreakpointDimensionsContext'
import IsInteractiveModeContext, { IsInteractiveModeContextType } from '~contexts/IsInteractiveModeContext'
import ComponentRemountContext, { ComponentRemountContextType } from '~contexts/ComponentRemountContext'

import usePersistedState from '~hooks/usePersistedState'

import breakpoints from '~data/breakpoints'

type ProviderComponentPropsType = {
  children: ReactNode
}

// The providers for the component scene
function ProviderComponent({ children }: ProviderComponentPropsType) {
  const [key, setKey] = useState(0)
  const componentRemountContextValue = useMemo<ComponentRemountContextType>(() => ({ key, setKey }), [key])

  const [hierarchy, setHierarchy] = useState<HierarchyType | null>(null)
  const [currentHierarchyId, setCurrentHierarchyId] = usePersistedState('current-hierarchy-id', '')
  const hierarchyContextValue = useMemo<HierarchyContextType>(() => ({ hierarchy, setHierarchy, currentHierarchyId, setCurrentHierarchyId }), [hierarchy, currentHierarchyId, setCurrentHierarchyId])

  const [breakpoint, setBreakpoint] = usePersistedState<BreakpointType>('breakpoint', breakpoints[1])
  const breakpointContextValue = useMemo<BreakpointContextType>(() => ({ breakpoint, setBreakpoint }), [breakpoint, setBreakpoint])

  const [width, setWidth] = usePersistedState<number>('width', 0, (x: any) => parseFloat(x))
  const [height, setHeight] = usePersistedState<number | null>('height', null, (x: any) => {
    const n = parseFloat(x)

    return n === n ? n : x
  })
  const [isDraggingWidth, setIsDraggingWidth] = useState(false)
  const [isDraggingHeight, setIsDraggingHeight] = useState(false)
  const breakpointDimensionsContextValue = useMemo<BreakpointDimensionsContextType>(() => ({ width, setWidth, height, setHeight, isDraggingWidth, setIsDraggingWidth, isDraggingHeight, setIsDraggingHeight }), [width, setWidth, height, setHeight, isDraggingWidth, isDraggingHeight])

  const [isInteractiveMode, setIsInteractiveMode] = usePersistedState('interactive-mode', false)
  const isInteractiveModeContextValue = useMemo<IsInteractiveModeContextType>(() => ({ isInteractiveMode, setIsInteractiveMode }), [isInteractiveMode, setIsInteractiveMode])

  return (
    <ComponentRemountContext.Provider value={componentRemountContextValue}>
      <HierarchyContext.Provider value={hierarchyContextValue}>
        <BreakpointContext.Provider value={breakpointContextValue}>
          <BreakpointDimensionsContext.Provider value={breakpointDimensionsContextValue}>
            <IsInteractiveModeContext.Provider value={isInteractiveModeContextValue}>
              {children}
            </IsInteractiveModeContext.Provider>
          </BreakpointDimensionsContext.Provider>
        </BreakpointContext.Provider>
      </HierarchyContext.Provider>
    </ComponentRemountContext.Provider>
  )
}

export default ProviderComponent
