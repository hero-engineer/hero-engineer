import { Dispatch, SetStateAction } from 'react'
import { File } from '@babel/types'
import { ParseResult } from '@babel/parser'
/* ---
  CLIENT
--- */

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

/* ---
  SERVER
--- */

export type TripletType = [string, string, string]
export interface GraphNode {
  id: string
  type: string
}
export type GraphType = {
  nodes: {
    [id: string]: GraphNode
  }
  triplets: Array<TripletType>
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

export interface FileType extends GraphNode {
  type: 'File',
  name: string
  path: string
  text: string
  ast: ParseResult<File>
}

export type ConfigurationType = {
  appRoot?: string
  srcLocation?: string
  appLocation?: string
  scenesLocation?: string
  componentsLocation?: string
}

export type ExtendedConfigurationType = ConfigurationType & {
  rootPath: string
  srcPath: string
  appPath: string
  componentsPath: string
  scenesPath: string
}
