import { Dispatch, SetStateAction } from 'react'

export type EcuType = {
  component: {
    index: string
    name: string
  },
  dragState: {
    sourceIndex: string
    targetIndex: string
    position: 'before' | 'after'
    rect: DOMRect
    mouse: { x: number, y: number }
  }
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

export type QueryResultsType<K extends string, P> = {
  [key in K]: P
}

export type SceneType = {
  name: string
  url: string
}

export type ComponentType = {
  name: string
  props: Record<string, any> & { children?: ComponentType[] }
  importType: 'named' | 'default'
  importName: string
  importPath: string
}

export type FileType = {
  name: string
  location: string,
}
