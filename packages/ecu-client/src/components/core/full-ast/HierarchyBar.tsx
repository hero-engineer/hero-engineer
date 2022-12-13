import { Fragment, memo, useCallback, useContext, useMemo } from 'react'
import { Div } from 'honorable'

import { HierarchyType } from '~types'

import { zIndexes } from '~constants'

import HierarchyContext from '~contexts/HierarchyContext2'
import BreakpointContext from '~contexts/BreakpointContext'
import IsInteractiveModeContext from '~contexts/IsInteractiveModeContext'

function hasHierarchyChild(hierarchy: HierarchyType, targetId: string): boolean {
  return hierarchy.id === targetId || hierarchy.children.some(h => hasHierarchyChild(h, targetId))
}

function flattenHierarchy(hierarchy: HierarchyType, targetId: string): HierarchyType[] {
  if (hierarchy.id === targetId) return [hierarchy]

  const indexOfChild = hierarchy.children.findIndex(h => hasHierarchyChild(h, targetId))

  if (indexOfChild === -1) return []

  return [hierarchy, ...flattenHierarchy(hierarchy.children[indexOfChild], targetId)]
}

function isCurrentParentComponent(hierarchy: HierarchyType, targetId: string) {
  return hierarchy.type === 'component' && hasHierarchyChild(hierarchy, targetId)
}

const height = 32
const caretSize = Math.sqrt(height ** 2 / 2)

// The hierarchy bar displays the flattened hierarchy of the current component
function HierarchyBar() {
  const { isDragging } = useContext(BreakpointContext)
  const { isInteractiveMode } = useContext(IsInteractiveModeContext)
  const { hierarchy, currentHierarchyId, setCurrentHierarchyId } = useContext(HierarchyContext)

  const flattenedHierarchy = useMemo(() => hierarchy ? flattenHierarchy(hierarchy, currentHierarchyId) : [], [hierarchy, currentHierarchyId])

  const handleClick = useCallback((hierarchy: HierarchyType) => {
    setCurrentHierarchyId(hierarchy.id)
  }, [setCurrentHierarchyId])

  if (isDragging) return null

  return (
    <Div
      xflex="x4"
      flexShrink={0}
      height={height}
      fontSize="0.75rem"
      userSelect="none"
      backgroundColor="background-light"
      borderTop="1px solid border"
      gap={0.25}
      px={0.5}
    >
      {!isInteractiveMode && flattenedHierarchy.map((hierarchy, i, a) => {
        const isLatestParent = hierarchy.id !== currentHierarchyId && isCurrentParentComponent(hierarchy, currentHierarchyId) && !a.slice(i + 2).some(h => isCurrentParentComponent(h, currentHierarchyId))

        return (
          <Fragment key={hierarchy.id}>
            <Div
              xflex="x4"
              onClick={() => handleClick(hierarchy)}
              textUnderlineOffset={3}
              textDecoration={isLatestParent ? 'underline' : 'none'}
              title={isLatestParent ? 'Parent of the selected component' : undefined}
              cursor="pointer"
              zIndex={zIndexes.hierarchyBarItem + 1}
            >
              {hierarchy.name}
            </Div>
            {i < a.length - 1 && (
              <Div
                borderTop="1px solid border"
                borderRight="1px solid border"
                width={caretSize}
                height={caretSize}
                transform="scaleX(0.75) rotate(45deg)"
                transformOrigin="center"
                ml={`${-caretSize / 2}px`}
                mr={0.25}
                zIndex={zIndexes.hierarchyBarItem}
              />
            )}
          </Fragment>
        )
      })}
      {!isInteractiveMode && !flattenedHierarchy.length && 'No element selected'}
      {isInteractiveMode && 'Interactive mode'}
    </Div>
  )
}

export default memo(HierarchyBar)
