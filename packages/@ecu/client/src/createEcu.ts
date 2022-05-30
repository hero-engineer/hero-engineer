import { EcuType } from './types'

function createEcu(): EcuType {
  return {
    activeIndex: '-1',
    hoveredIndex: null,
    dragIndex: null,
    dragHoveredIndex: null,
    dragRect: null,
    dragMousePosition: { x: 0, y: 0 },
    createEditorId: () => Math.random(),
  }
}

export default createEcu
