export type EcuType = {
  activeIndex: string
  hoveredIndex: string
  dragIndex: string
  dragHoveredIndex: string
  dragRect: DOMRect
  dragMousePosition: { x: number, y: number }
  createEditorId: () => number
}

export type MenuItemType = {
  label: string
  on: 'component'
  handler: (ecu: EcuType) => void
}

export type PositionType = {
  x: number
  y: number
}
