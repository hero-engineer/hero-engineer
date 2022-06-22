import { Dispatch, SetStateAction } from 'react'
import { File, FunctionDeclaration } from '@babel/types'
import { ParseResult } from '@babel/parser'
import { NodePath } from '@babel/traverse'
import { Particule } from 'ecu-particule'

/* ---
  CLIENT
--- */

export type EcuType = {
  parentComponent: FunctionType
  activeComponent: FunctionType
  activeComponentIndex: string
  dragState: {
    sourceIndex: string
    targetIndex: string
    position: 'before' | 'after'
    rect: DOMRect
    mouse: { x: number, y: number }
  }
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

export type ConfigurationType = {
  appRoot?: string
  srcLocation?: string
  appLocation?: string
  scenesLocation?: string
  componentsLocation?: string
}

export type ExtendedConfigurationType = ConfigurationType & {
  configurationPath: string,
  rootPath: string
  srcPath: string
  appPath: string
  componentsPath: string
  scenesPath: string
}

export type GraphNodeType = Particule
export type GraphEdgeType = [GraphNodeType['address'], GraphNodeType['address'], GraphNodeType['address']]
export type GraphType = {
  nodes: {
    [address: string]: GraphNodeType
  }
  edges: Array<GraphEdgeType>
}
export type ExportType = 'default' | 'named' | 'none'
export type SceneType = {
  name: string
  url: string
}

export interface FileType extends GraphNodeType {
  type: 'File',
  name: string
  extension: string
  path: string
  relativePath: string
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

export type ComponentModelType = {
  fn: FunctionType
  file: FileType
  props: PropsType
}

export type PropsType = Record<string, any> & {
  children?: ComponentModelType[]
}
