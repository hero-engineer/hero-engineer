// import { Dispatch, SetStateAction } from 'react'
import { File, FunctionDeclaration } from '@babel/types'
import { ParseResult } from '@babel/parser'
import { NodePath } from '@babel/traverse'
import { Particule } from 'ecu-particule'

/* ---
  SERVER
--- */

export type GraphNodeType = Particule
export type GraphEdgeType = [GraphNodeType['address'], GraphNodeType['address'], GraphNodeType['address']]
export type GraphType = {
  nodes: Record<string, GraphNodeType>
  edges: Array<GraphEdgeType>
}
export type ExportType = 'default' | 'named' | 'none'

export interface FileNodeType extends GraphNodeType {
  role: 'File',
  payload: {
    name: string
    extension: string
    path: string
    relativePath: string
    text: string
    ast: ParseResult<File>
  }
}

export interface FunctionNodeType extends GraphNodeType {
  role: 'Function',
  payload: {
    name: string
    path: string
    relativePath: string
    exportType: ExportType
    isComponent: boolean
    astPath: NodePath<FunctionDeclaration>
  }
}

// export type ComponentModelType = {
//   fn: FunctionType
//   file: FileType
//   props: PropsType
// }

// export type PropsType = Record<string, any> & {
//   children?: ComponentModelType[]
// }

/* ---
  CLIENT
--- */

// export type EcuType = {
//   parentComponent?: FunctionType
//   activeComponent?: FunctionType
//   activeComponentPath?: string
//   dragState?: {
//     sourcePath?: string
//     targetPath?: string
//     position?: 'before' | 'after'
//     rect?: DOMRect
//     mouse?: { x: number, y: number }
//   }
// }

// export type EcuDispatcherType = Dispatch<SetStateAction<EcuType>>
// export type EcuContextType = [EcuType, EcuDispatcherType]

// export type MenuItemType = {
//   label: string
//   on: 'component'
//   handler: (ecu: EcuType, setEcu: EcuDispatcherType) => void
// }

// export type PositionType = {
//   x: number
//   y: number
// }

// export type QueryResultsType<K extends string, P> = {
//   [key in K]: P
// }
