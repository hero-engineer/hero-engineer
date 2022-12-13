import { MouseEvent, ReactNode, useCallback, useState } from 'react'
import { Div } from 'honorable'

import { HierarchyType } from '~types'

import { zIndexes } from '~constants'

type HierarchyOverlayElementPropsType = {
  hierarchy: HierarchyType
  parentHierarchy: HierarchyType | null
  isSelected: boolean
  onSelect: () => void
  children: ReactNode
}

const typeToColor = {
  component: 'type-component',
  element: 'type-element',
  children: 'type-children',
  array: 'type-array',
  text: 'type-text',
}

function HierarchyOverlayElement({ hierarchy, parentHierarchy, isSelected, onSelect, children }: HierarchyOverlayElementPropsType) {
  const [isHovered, setIsHovered] = useState(false)

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

  const color = typeToColor[hierarchy.type]
  const { top, left, width, height } = getLimitedDomRect(hierarchy)
  const { top: parentTop, left: parentLeft } = parentHierarchy ? getLimitedDomRect(parentHierarchy) : { top: 0, left: 0 }

  return (
    <Div
      position="absolute"
      top={top - parentTop}
      left={left - parentLeft}
      width={width}
      height={height}
      color={color}
      outline={isSelected || isHovered ? `1px solid ${color}` : undefined}
      onClick={handleClick}
      onMouseMove={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      zIndex={isHovered ? zIndexes.hierarchyOverlayElement : 'auto'}
    >
      <Div
        id="HierarchyOverlayElement-vignette"
        xflex="x4"
        display={isSelected || isHovered ? 'flex' : 'none'}
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
  if (hierarchy.element && hierarchy.element.nodeType !== Node.TEXT_NODE) return [hierarchy.element]

  return hierarchy.children.map(getChildElements).flat()
}

export default HierarchyOverlayElement
