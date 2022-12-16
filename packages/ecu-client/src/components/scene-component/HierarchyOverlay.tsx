import { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { Div } from 'honorable'

import HierarchyOverlayElement from '~components/scene-component/HierarchyOverlayElement'

import { HierarchyType } from '~types'

import IsInteractiveModeContext from '~contexts/IsInteractiveModeContext'
import HierarchyContext from '~contexts/HierarchyContext'
import BreakpointContext from '~contexts/BreakpointContext'

type HierarchyOverlayPropsType = {
  children: ReactNode
}

function HierarchyOverlay({ children }: HierarchyOverlayPropsType) {
  const { isDragging, width, height } = useContext(BreakpointContext)
  const { isInteractiveMode } = useContext(IsInteractiveModeContext)
  const { hierarchy, currentHierarchyId, setCurrentHierarchyId } = useContext(HierarchyContext)

  const [isScrolling, setIsScrolling] = useState(false)

  const renderOverlayElement = useCallback((hierarchy: HierarchyType, parentHierarchy: HierarchyType | null = null) => {
    if (hierarchy.type === 'text') return null

    return (
      <HierarchyOverlayElement
        key={hierarchy.id}
        hierarchy={hierarchy}
        parentHierarchy={parentHierarchy}
        isSelected={hierarchy.id === currentHierarchyId}
        isHidden={isScrolling}
        onSelect={() => setCurrentHierarchyId(hierarchy.id)}
        onScroll={() => setIsScrolling(true)}
      >
        {hierarchy.children.map(childHierarchy => renderOverlayElement(childHierarchy, hierarchy))}
      </HierarchyOverlayElement>
    )
  }, [currentHierarchyId, isScrolling, setCurrentHierarchyId])

  const renderOverlay = useCallback(() => {
    if (!hierarchy) return null

    return (
      <Div
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
      >
        {renderOverlayElement(hierarchy)}
      </Div>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hierarchy, width, height, renderOverlayElement])

  useEffect(() => {
    if (!isScrolling) return

    const timeoutId = setTimeout(() => {
      setIsScrolling(false)
    }, 250)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isScrolling])

  return (
    <Div
      position="relative"
      height={height}
      overflow="hidden"
    >
      {children}
      {!(isDragging || isInteractiveMode) && renderOverlay()}
    </Div>
  )
}

export default HierarchyOverlay
