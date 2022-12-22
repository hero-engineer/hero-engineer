import { ReactNode, memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Div } from 'honorable'

import { HierarchyType } from '~types'

import IsInteractiveModeContext from '~contexts/IsInteractiveModeContext'
import HierarchyContext from '~contexts/HierarchyContext'
import BreakpointDimensionsContext from '~contexts/BreakpointDimensionsContext'

import HierarchyOverlayElement from '~components/scene-component/hierarchy-overlay/HierarchyOverlayElement'

type HierarchyOverlayPropsType = {
  children: ReactNode
}

function HierarchyOverlay({ children }: HierarchyOverlayPropsType) {
  const childrenRef = useRef<HTMLDivElement>(null)

  const { width, height, isDraggingWidth, isDraggingHeight } = useContext(BreakpointDimensionsContext)
  const { isInteractiveMode } = useContext(IsInteractiveModeContext)
  const { hierarchy, currentHierarchyId, setCurrentHierarchyId } = useContext(HierarchyContext)

  const [isScrolling, setIsScrolling] = useState(false)
  const [refresh, setRefresh] = useState(0)

  const renderOverlayElement = useCallback((hierarchy: HierarchyType, parentHierarchy: HierarchyType | null = null) => (
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
  ), [currentHierarchyId, isScrolling, setCurrentHierarchyId])

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
  }, [hierarchy, width, height, refresh, renderOverlayElement])

  useEffect(() => {
    if (!isScrolling) return

    const timeoutId = setTimeout(() => {
      setIsScrolling(false)
    }, 250)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isScrolling])

  useEffect(() => {
    if (!childrenRef.current) return

    const mutationObserver = new MutationObserver(() => {
      setRefresh(x => x + 1)
    })

    mutationObserver.observe(childrenRef.current, {
      characterData: true,
      attributes: true,
      childList: true,
      subtree: true,
    })

    return () => {
      mutationObserver.disconnect()
    }
  }, [])

  return (
    <Div
      xflex="y2s"
      position="relative"
      height={height}
    >
      <Div
        ref={childrenRef}
        xflex="y2s"
      >
        {children}
      </Div>
      {!(isDraggingWidth || isDraggingHeight || isInteractiveMode) && renderOverlay()}
    </Div>
  )
}

export default memo(HierarchyOverlay)
