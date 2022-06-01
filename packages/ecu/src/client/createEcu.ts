import { EcuType } from '../types'

function createEcu(): EcuType {
  return {
    component: {
      index: null,
      name: null,
    },
    dragState: {
      sourceIndex: null,
      targetIndex: null,
      position: null,
      rect: null,
      mouse: { x: 0, y: 0 },
    },
    createEditorId: () => Math.random(),
  }
}

export default createEcu
