import { ReactNode, useCallback, useContext } from 'react'
import { Div } from 'honorable'

import { HierarchyType } from '~types'

import IsInteractiveModeContext from '~contexts/IsInteractiveModeContext'
import HierarchyContext from '~contexts/HierarchyContext2'

import HierarchyOverlayElement from '~core/full-ast/HierarchyOverlayElement'

type HierarchyOverlayPropsType = {
  children: ReactNode
}

function HierarchyOverlay({ children }: HierarchyOverlayPropsType) {
  const { isInteractiveMode } = useContext(IsInteractiveModeContext)
  const { hierarchy, currentHierarchyId, setCurrentHierarchyId } = useContext(HierarchyContext)

  const renderOverlayElement = useCallback((hierarchy: HierarchyType, parentHierarchy: HierarchyType | null = null) => {
    if (hierarchy.element?.nodeType === Node.TEXT_NODE) return null

    return (
      <HierarchyOverlayElement
        key={hierarchy.id}
        hierarchy={hierarchy}
        parentHierarchy={parentHierarchy}
        isSelected={hierarchy.id === currentHierarchyId}
        onSelect={() => setCurrentHierarchyId(hierarchy.id)}
      >
        {hierarchy.children.map(childHierarchy => renderOverlayElement(childHierarchy, hierarchy))}
      </HierarchyOverlayElement>
    )
  }, [currentHierarchyId, setCurrentHierarchyId])

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
  }, [hierarchy, renderOverlayElement])

  return (
    <Div position="relative">
      {children}
      {!isInteractiveMode && renderOverlay()}
    </Div>
  )
}

export default HierarchyOverlay
