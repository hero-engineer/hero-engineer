import { Fragment, MouseEvent as ReactMouseEvent, ReactNode, memo, useCallback, useContext, useEffect, useState } from 'react'
import { Div } from 'honorable'

import { zIndexes } from '../../constants'
import { HierarchyItemType } from '../../types'

import HierarchyContext from '../../contexts/HierarchyContext'
import EditionContext from '../../contexts/EditionContext'
import EditionOverlayContext from '../../contexts/EditionOverlayContext'
import IsInteractiveModeContext from '../../contexts/IsInteractiveModeContext'
import IsComponentRefreshingContext from '../../contexts/IsComponentRefreshingContext'
import BreakpointContext from '../../contexts/BreakpointContext'

import useHierarchySelection from '../../hooks/useHierarchySelection'

import getComponentRootHierarchyIds from '../../utils/getComponentRootHierarchyIds'
import findHierarchyIdAndComponentDelta from '../../utils/findHierarchyIdAndComponentDelta'

import EditionOverlayElement from './EditionOverlayElement'

type LimitedDOMRect = Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>

type EditionOverlayPropsType = {
  children: ReactNode
}

function EditionOverlay({ children }: EditionOverlayPropsType) {
  const { totalHierarchy } = useContext(HierarchyContext)
  const { hierarchyId, componentDelta, isEdited, setIsEdited } = useContext(EditionContext)
  const { elementRegistry } = useContext(EditionOverlayContext)
  const { isInteractiveMode } = useContext(IsInteractiveModeContext)
  const { isComponentRefreshing } = useContext(IsComponentRefreshingContext)
  const { isDragging } = useContext(BreakpointContext)

  const [refresh, setRefresh] = useState(0)
  const [helperText, setHelperText] = useState('')

  const handleHierarchySelect = useHierarchySelection()

  const handleElementSelect = useCallback((event: ReactMouseEvent, hierarchyItem: HierarchyItemType, nextHierarchyId: string, nextComponentDelta: number) => {
    const isOnComponent = handleHierarchySelect(event, hierarchyItem, nextHierarchyId, nextComponentDelta)

    setHelperText(isOnComponent ? '' : `Editable under ${hierarchyItem.onComponentName}`)
  }, [handleHierarchySelect])

  const renderHierarchy: (hierarchyItem: HierarchyItemType | null, depth?: number) => ReactNode = useCallback((hierarchyItem: HierarchyItemType | null, depth = zIndexes.editionOverlay + 1) => {
    if (!hierarchyItem) return null

    const element = elementRegistry[hierarchyItem.hierarchyId ?? ''] ?? null
    let currentHierarchyId: string
    let currentComponentDelta: number
    let rect: LimitedDOMRect

    if (hierarchyItem.hierarchyId) {
      if (!element) return null

      currentHierarchyId = hierarchyItem.hierarchyId
      currentComponentDelta = 0
      rect = element.getBoundingClientRect()
    }
    else {
      const found = findHierarchyIdAndComponentDelta(totalHierarchy, hierarchyItem)

      if (found) {
        currentHierarchyId = found.hierarchyId
        currentComponentDelta = found.componentDelta
      }
      else {
        return null
      }

      rect = getComponentRootHierarchyIds([hierarchyItem])
        .map(rootHierarchyId => elementRegistry[rootHierarchyId])
        .filter(Boolean)
        .map(element => element!.getBoundingClientRect())
        .reduce((acc, { top, bottom, left, right }) => ({
          maxBottom: Math.max(acc.maxBottom, bottom),
          maxRight: Math.max(acc.maxRight, right),
          top: Math.min(acc.top, top),
          left: Math.min(acc.left, left),
          width: Math.max(acc.width, Math.max(acc.maxRight, right) - Math.min(acc.left, left)),
          height: Math.max(acc.height, Math.max(acc.maxBottom, bottom) - Math.min(acc.top, top)),
        }), {
          maxBottom: 0,
          maxRight: 0,
          top: Infinity,
          left: Infinity,
          width: 0,
          height: 0,
        })
    }

    const isSelected = currentHierarchyId === hierarchyId && currentComponentDelta === componentDelta

    return (
      <>
        <EditionOverlayElement
          hierarchyItem={hierarchyItem}
          element={element}
          depth={depth}
          top={rect.top}
          left={rect.left}
          width={rect.width}
          height={rect.height}
          isSelected={isSelected}
          isEdited={isSelected && isEdited}
          isComponentRoot={!!hierarchyItem.componentAddress}
          helperText={isSelected ? helperText : ''}
          onSelect={(event: ReactMouseEvent) => handleElementSelect(event, hierarchyItem, currentHierarchyId, currentComponentDelta)}
        />
        {(hierarchyItem.children || []).map(child => (
          <Fragment key={child.id}>
            {renderHierarchy(child, depth + 1)}
          </Fragment>
        ))}
      </>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    elementRegistry,
    totalHierarchy,
    hierarchyId,
    componentDelta,
    isEdited,
    helperText,
    handleElementSelect,
    refresh,
  ])

  useEffect(() => {
    const resizeObservers: ResizeObserver[] = []
    const mutationObservers: MutationObserver[] = []

    Object.keys(elementRegistry).forEach(hierarchyId => {
      const element = elementRegistry[hierarchyId]

      if (!element) return

      const resizeObserver = new ResizeObserver(() => setRefresh(x => x + 1))

      resizeObserver.observe(element)
      resizeObservers.push(resizeObserver)

      const mutationObserver = new MutationObserver(() => setRefresh(x => x + 1))

      mutationObserver.observe(element, {
        attributes: true,
        childList: true,
        subtree: true,
      })
      mutationObservers.push(mutationObserver)
    })

    return () => {
      for (const observer of resizeObservers) {
        observer.disconnect()
      }
      for (const observer of mutationObservers) {
        observer.disconnect()
      }
    }
  }, [elementRegistry])

  useEffect(() => {
    if (!isEdited) return

    const editedElement = elementRegistry[hierarchyId]

    if (!editedElement) return

    let firstTrigger = true

    function handleMouseClick(event: MouseEvent) {
      if (firstTrigger) {
        firstTrigger = false

        return
      }

      if (editedElement?.contains(event.target as Node)) return

      setIsEdited(false)
    }

    window.addEventListener('click', handleMouseClick)

    return () => {
      window.removeEventListener('click', handleMouseClick)
    }
  }, [elementRegistry, hierarchyId, isEdited, setIsEdited])

  useEffect(() => {
    if (!helperText) return

    const timeoutId = setTimeout(() => {
      setHelperText('')
    }, 2000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [helperText])

  return (
    <Div
      xflex="y2s"
      position="relative"
    >
      {children}
      {!isInteractiveMode && (
        <Div
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          zIndex={zIndexes.editionOverlay}
          pointerEvents={isEdited ? 'none' : 'auto'}
          backgroundColor={isComponentRefreshing ? 'rgba(0, 0, 0, 0.5)' : null}
        >
          {!isComponentRefreshing && !isDragging && renderHierarchy(totalHierarchy)}
        </Div>
      )}
    </Div>
  )
}

export default memo(EditionOverlay)
