import { EcuType } from '../types'

function createEcu(): EcuType {
  return {
    parentComponent: null,
    activeComponent: null,
    activeComponentIndex: '0',
    dragState: {
      sourceIndex: null,
      targetIndex: null,
      position: null,
      rect: null,
      mouse: { x: 0, y: 0 },
    },
  }
}

export default createEcu
