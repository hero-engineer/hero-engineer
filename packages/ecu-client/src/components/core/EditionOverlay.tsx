import { Fragment, MouseEvent as ReactMouseEvent, ReactNode, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Div } from 'honorable'

import { zIndexes } from '../../constants'
import { HierarchyItemType } from '../../types'

import HierarchyContext from '../../contexts/HierarchyContext'
import EditionContext from '../../contexts/EditionContext'
import EditionOverlayContext, { EditionOverlayContextType } from '../../contexts/EditionOverlayContext'

import getComponentRootHierarchyIds from '../../utils/getComponentRootHierarchyIds'
import findHierarchyIdsAndComponentDelta from '../../utils/findHierarchyIdsAndComponentDelta'

import EditionOverlayElement from './EditionOverlayElement'

type LimitedDOMRect = Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>

type EditionOverlayPropsType = {
  children: ReactNode
}

function EditionOverlay({ children }: EditionOverlayPropsType) {
  const { totalHierarchy } = useContext(HierarchyContext)
  const { hierarchyId, setHierarchyId, componentDelta, setComponentDelta, isEdited, setIsEdited } = useContext(EditionContext)
  const [refresh, setRefresh] = useState(0)

  const [elementRegistry, setElementRegistry] = useState<Record<string, HTMLElement | null>>({})
  const editionOverlayContextValue = useMemo<EditionOverlayContextType>(() => ({ elementRegistry, setElementRegistry }), [elementRegistry])

  const handleElementSelect = useCallback((event: ReactMouseEvent, hierarchyItem: HierarchyItemType, nextHierarchyId: string, nextComponentDelta: number) => {
    if (nextHierarchyId === hierarchyId && nextComponentDelta === componentDelta) {
      if (event.detail > 1 && hierarchyItem.isComponentEditable) {
        event.stopPropagation()

        setIsEdited(true)
      }
    }
    else {
      setHierarchyId(nextHierarchyId)
      setComponentDelta(nextComponentDelta)
      setIsEdited(false)
    }
  }, [hierarchyId, componentDelta, setHierarchyId, setComponentDelta, setIsEdited])

  const renderHierarchy: (hierarchyItem: HierarchyItemType | null, depth?: number) => ReactNode = useCallback((hierarchyItem: HierarchyItemType | null, depth = zIndexes.editionOverlay + 1) => {
    if (!hierarchyItem) return null

    let currentHierarchyId: string
    let currentComponentDelta: number
    let rect: LimitedDOMRect

    if (!hierarchyItem.hierarchyId) {
      const found = findHierarchyIdsAndComponentDelta(totalHierarchy, hierarchyItem)

      if (found) {
        [currentHierarchyId] = found.hierarchyIds
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
    else {
      currentHierarchyId = hierarchyItem.hierarchyId
      currentComponentDelta = 0

      const element = elementRegistry[hierarchyItem.hierarchyId]

      if (!element) return null

      rect = element.getBoundingClientRect()
    }

    const isSelected = currentHierarchyId === hierarchyId && currentComponentDelta === componentDelta

    return (
      <>
        <EditionOverlayElement
          hierarchyItem={hierarchyItem}
          depth={depth}
          top={rect.top}
          left={rect.left}
          width={rect.width}
          height={rect.height}
          isSelected={isSelected}
          isEdited={isSelected && isEdited}
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
    handleElementSelect,
    refresh,
  ])

  useEffect(() => {
    const observers: ResizeObserver[] = []

    Object.keys(elementRegistry).forEach(hierarchyId => {
      const element = elementRegistry[hierarchyId]

      if (!element) return

      const observer = new ResizeObserver(() => setRefresh(x => x + 1))

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      for (const observer of observers) {
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

  return (
    <EditionOverlayContext.Provider value={editionOverlayContextValue}>
      <Div
        xflex="y2s"
        position="relative"
      >
        {children}
        <Div
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          zIndex={zIndexes.editionOverlay}
          pointerEvents={isEdited ? 'none' : 'auto'}
        >
          {renderHierarchy(totalHierarchy)}
        </Div>
      </Div>
    </EditionOverlayContext.Provider>
  )
}

export default memo(EditionOverlay)
