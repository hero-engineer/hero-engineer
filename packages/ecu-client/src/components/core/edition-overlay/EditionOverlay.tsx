import { Fragment, MouseEvent as ReactMouseEvent, ReactNode, memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Div } from 'honorable'

import EditionOverlayElement from './EditionOverlayElement'

import { HierarchyItemType } from '@types'

import { zIndexes } from '@constants'

import HierarchyContext from '@contexts/HierarchyContext'
import EditionContext from '@contexts/EditionContext'
import EditionOverlayContext from '@contexts/EditionOverlayContext'
import IsInteractiveModeContext from '@contexts/IsInteractiveModeContext'
import IsComponentRefreshingContext from '@contexts/IsComponentRefreshingContext'
import BreakpointContext from '@contexts/BreakpointContext'

import useHierarchySelection from '@hooks/useHierarchySelection'

import getComponentRootHierarchyIds from '@utils/getComponentRootHierarchyIds'
import findHierarchyIdAndComponentDelta from '@utils/findHierarchyIdAndComponentDelta'

type LimitedDOMRect = Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>

type DragAndDropStateType = {
  isDragging: boolean
  isVertical?: boolean
  hierarchyId?: string
  componentDelta?: number
  childrenIndex?: number
  childrenPosition?: 'before' | 'after'
  knobRect?: LimitedDOMRect
}

type IndexAndPositionType = {
  index: number,
  position: 'before' | 'after'
}

type EditionOverlayPropsType = {
  children: ReactNode
}

const dragAndDropKnobOffset = 2

function EditionOverlay({ children }: EditionOverlayPropsType) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const { componentAddress = '' } = useParams()

  const { totalHierarchy } = useContext(HierarchyContext)
  const { hierarchyId, componentDelta, isEdited, setIsEdited } = useContext(EditionContext)
  const { elementRegistry } = useContext(EditionOverlayContext)
  const { isInteractiveMode } = useContext(IsInteractiveModeContext)
  const { isComponentRefreshing } = useContext(IsComponentRefreshingContext)
  const { isDragging } = useContext(BreakpointContext)
  const [dragAndDropState, setDragAndDropState] = useState<DragAndDropStateType>({ isDragging: false })

  const [refresh, setRefresh] = useState(0)
  const [helperText, setHelperText] = useState('')

  const handleHierarchySelect = useHierarchySelection()

  const handleElementSelect = useCallback((event: ReactMouseEvent, hierarchyItem: HierarchyItemType, nextHierarchyId: string, nextComponentDelta: number) => {
    const isOnComponent = handleHierarchySelect(event, hierarchyItem, nextHierarchyId, nextComponentDelta)

    setHelperText(isOnComponent ? '' : `Editable under ${hierarchyItem.onComponentName}`)
  }, [handleHierarchySelect])

  const handleMouseUp = useCallback(() => {
    setDragAndDropState({ isDragging: false })
  }, [])

  const handleElementMouseMove = useCallback((event: ReactMouseEvent, hierarchyItem: HierarchyItemType, hierarchyId: string, componentDelta: number) => {
    if (!dragAndDropState.isDragging) return
    if (!hierarchyItem.isComponentAcceptingChildren) return
    if (hierarchyItem.onComponentAddress !== componentAddress) return
    if (!overlayRef.current) return

    event.stopPropagation()

    const element = elementRegistry[hierarchyId] ?? null

    let isVertical = true

    if (element) {
      const { display, flexDirection } = window.getComputedStyle(element)

      isVertical = !((display === 'flex' || display === 'inline-flex') && flexDirection === 'row')
    }

    let knobRect: LimitedDOMRect | undefined
    let childrenIndex = -1
    let childrenPosition: 'before' | 'after' = 'before'

    if (element) {
      const { top: globalTop, left: globalLeft } = overlayRef.current.getBoundingClientRect()
      const axisValue = isVertical ? event.clientY - globalTop : event.clientX - globalLeft
      const childrenRects: DOMRect[] = []

      for (let i = 0; i < element.children.length; i++) {
        const childElement = element.children[i] as HTMLElement

        childrenRects.push(childElement.getBoundingClientRect())
      }

      const minAndMaxs = childrenRects.map((rect, index) => isVertical ? ({ index, min: rect.top, max: rect.bottom }) : ({ index, min: rect.left, max: rect.right }))
      const indexAndPosition = minAndMaxs.reduce<IndexAndPositionType>((acc, { index, min, max }) => {
        if (axisValue > min) {
          return {
            index,
            position: axisValue > min + (max - min) / 2 ? 'after' : 'before',
          }
        }

        return acc
      }, { index: 0, position: 'before' })

      childrenIndex = indexAndPosition.index
      childrenPosition = indexAndPosition.position
      const elementRect = element.getBoundingClientRect()
      const elementOffset = isVertical ? elementRect.top : elementRect.left
      const elementMax = isVertical ? elementRect.height : elementRect.width

      const min = childrenPosition === 'after'
        ? minAndMaxs[childrenIndex].max - elementOffset
        : childrenIndex
          ? minAndMaxs[childrenIndex - 1].max - elementOffset
          : 0
      const max = childrenPosition === 'after'
        ? childrenIndex === minAndMaxs.length - 1
          ? elementMax
          : minAndMaxs[childrenIndex + 1].min - elementOffset
        : minAndMaxs[childrenIndex].min - elementOffset

      let knobPosition = min + (max - min) / 2

      if (knobPosition === 0) knobPosition += 2
      if (knobPosition === elementMax) knobPosition -= 2

      knobRect = {
        top: elementRect.top + (isVertical ? knobPosition : dragAndDropKnobOffset),
        left: elementRect.left + (isVertical ? dragAndDropKnobOffset : knobPosition),
        width: isVertical ? elementRect.width - 2 * dragAndDropKnobOffset : 1,
        height: isVertical ? 1 : elementRect.height - 2 * dragAndDropKnobOffset,
      }
    }

    setDragAndDropState(x => ({ ...x, isVertical, hierarchyId, componentDelta, childrenIndex, childrenPosition, knobRect }))
  }, [componentAddress, dragAndDropState.isDragging, elementRegistry])

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
    const isDrop = !isSelected && dragAndDropState.hierarchyId === currentHierarchyId && dragAndDropState.componentDelta === currentComponentDelta

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
          isAnotherEdited={isEdited}
          isComponentRoot={!!hierarchyItem.componentAddress}
          isDragging={dragAndDropState.isDragging}
          isDisabled={dragAndDropState.isDragging && !(hierarchyItem.isComponentAcceptingChildren && hierarchyItem.onComponentAddress === componentAddress)}
          isDrop={isDrop}
          isDropVertical={isDrop ? dragAndDropState.isVertical ?? false : false}
          helperText={isSelected ? helperText : ''}
          onSelect={(event: ReactMouseEvent) => handleElementSelect(event, hierarchyItem, currentHierarchyId, currentComponentDelta)}
          onMouseDown={(event: ReactMouseEvent) => event.detail < 2 && isSelected && !isEdited && setDragAndDropState({ isDragging: true })}
          onMouseMove={(event: ReactMouseEvent) => handleElementMouseMove(event, hierarchyItem, currentHierarchyId, currentComponentDelta)}
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
    componentAddress,
    elementRegistry,
    totalHierarchy,
    hierarchyId,
    componentDelta,
    isEdited,
    helperText,
    dragAndDropState,
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

  useEffect(() => {
    if (!dragAndDropState.isDragging) return

    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragAndDropState.isDragging, handleMouseUp])

  return (
    <Div
      xflex="y2s"
      position="relative"
    >
      {children}
      {!isInteractiveMode && (
        <Div
          ref={overlayRef}
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
          {dragAndDropState.knobRect && (
            <Div
              position="absolute"
              top={dragAndDropState.knobRect.top}
              left={dragAndDropState.knobRect.left}
              width={dragAndDropState.knobRect.width}
              height={dragAndDropState.knobRect.height}
              backgroundColor="drag-and-drop-knob"
            />
          )}
        </Div>
      )}
    </Div>
  )
}

export default memo(EditionOverlay)
