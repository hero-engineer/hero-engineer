import { MouseEvent, ReactNode, memo, useCallback, useEffect, useRef, useState } from 'react'
import { Div } from 'honorable'

import { HierarchyType } from '~types'

import { zIndexes } from '~constants'

type HierarchyOverlayElementPropsType = {
  hierarchy: HierarchyType
  parentHierarchy: HierarchyType | null
  isSelected: boolean
  isHidden: boolean
  onSelect: () => void
  onScroll: () => void
  children: ReactNode
}

const typeToColor = {
  component: 'hierarchy-type-component',
  element: 'hierarchy-type-element',
  children: 'hierarchy-type-children',
  array: 'hierarchy-type-array',
  text: 'hierarchy-type-text',
}

function scrollElement(element: HTMLElement, deltaY: number, deltaX: number): boolean {
  const beforeTop = element.scrollTop
  const beforeLeft = element.scrollLeft

  element.scrollTop += deltaY
  element.scrollLeft += deltaX

  if (beforeTop !== element.scrollTop || beforeLeft !== element.scrollLeft) return true
  if (element.parentElement) return scrollElement(element.parentElement, deltaY, deltaX)

  return false
}

function getLimitedDomRect(hierarchy: HierarchyType) {
  if (hierarchy.element) return hierarchy.element.getBoundingClientRect()

  const childElements = getChildElements(hierarchy)

  return childElements
    .map(element => element.getBoundingClientRect())
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

function getChildElements(hierarchy: HierarchyType): HTMLElement[] {
  if (hierarchy.element && hierarchy.type !== 'text') return [hierarchy.element]

  return hierarchy.children.map(getChildElements).flat()
}

function HierarchyOverlayElement({ hierarchy, parentHierarchy, isSelected, isHidden, onSelect, onScroll, children }: HierarchyOverlayElementPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)

  const [isHovered, setIsHovered] = useState(false)

  // Scroll sub element
  // Prevent the page from scrolling if a sub element has scrolled
  const handleWheel = useCallback((event: WheelEvent) => {
    const element = hierarchy.element || getChildElements(hierarchy)[0]

    if (!element) return

    if (scrollElement(element, event.deltaY, event.deltaX)) {
      event.preventDefault()
      onScroll()
    }
  }, [hierarchy, onScroll])

  const handleHoverStart = useCallback((event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      setIsHovered(true)

      return
    }

    setIsHovered(false)
  }, [])

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false)
  }, [])

  const handleClick = useCallback((event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      onSelect()
    }
  }, [onSelect])

  useEffect(() => {
    const { current } = rootRef

    if (!current) return

    current.addEventListener('wheel', handleWheel, { passive: false }) // Passive is needed to prevent default

    return () => {
      current.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

  const color = typeToColor[hierarchy.type]
  const { top, left, width, height } = getLimitedDomRect(hierarchy)
  const { top: parentTop, left: parentLeft } = parentHierarchy ? getLimitedDomRect(parentHierarchy) : { top: 0, left: 0 }

  return (
    <Div
      ref={rootRef}
      position="absolute"
      top={top - parentTop}
      left={left - parentLeft}
      width={width}
      height={height}
      color={color}
      outline={(isSelected || isHovered) && !isHidden ? `1px solid ${color}` : undefined}
      onClick={handleClick}
      onMouseMove={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      zIndex={isHovered ? zIndexes.hierarchyOverlayElement : 'auto'}
    >
      <Div
        id="HierarchyOverlayElement-vignette"
        xflex="x4"
        display={isSelected && !isHidden ? 'flex' : 'none'}
        position="absolute"
        top={top - 16 < 0 ? 0 : -16}
        left={-1}
        height={16}
        backgroundColor={color}
        color="white"
        fontSize="0.75rem"
        cursor="pointer"
        userSelect="none"
        gap={0.25}
        px={0.25 * 2 / 3}
      >
        {hierarchy.name}
      </Div>
      {children}
    </Div>
  )
}

export default memo(HierarchyOverlayElement)
