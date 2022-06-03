import { Dispatch, SetStateAction } from 'react'
import { File, FunctionDeclaration } from '@babel/types'
import { ParseResult } from '@babel/parser'
import { NodePath } from '@babel/traverse'
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

export interface GraphNodeType {
  id: string
  type: string
}
export type TripletType = [string, string, string]
export type GraphType = {
  nodes: {
    [id: string]: GraphNodeType
  }
  triplets: Array<TripletType>
}
export type ExportType = 'default' | 'named' | 'none'
export type SceneType = {
  name: string
  url: string
}

export interface FileType extends GraphNodeType {
  type: 'File',
  name: string
  path: string
  text: string
  ast: ParseResult<File>
}

export interface FunctionType extends GraphNodeType {
  type: 'Function',
  name: string
  exportType: ExportType
  isComponent: boolean
  astPath: NodePath<FunctionDeclaration>
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
