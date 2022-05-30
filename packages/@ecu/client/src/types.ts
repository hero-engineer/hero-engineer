import { Dispatch, SetStateAction } from 'react'

export type EcuType = {
  activeIndex: string
  hoveredIndex: string
  dragIndex: string
  dragHoveredIndex: string
  dragRect: DOMRect
  dragMousePosition: { x: number, y: number }
  createEditorId: () => number
}

export type EcuDispatcherType = Dispatch<SetStateAction<EcuType>>
export type EcuContextType = [EcuType, EcuDispatcherType]

export type MenuItemType = {
  label: string
  on: 'component'
  handler: (ecu: EcuType, setEcu: EcuDispatcherType) => void
}

export type PositionType = {
  x: number
  y: number
}
