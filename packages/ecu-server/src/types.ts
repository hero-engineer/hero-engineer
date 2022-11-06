import { ParseResult } from '@babel/core'

export type Particule<PayloadType = any, StateType = any> = {
  // A unique address for this particule
  address: string
  // How a human or a machine understands what the particule does
  role: string
  // Internal state
  state: StateType
  // front-facing API
  payload: PayloadType
}

export type GraphNodeType = Particule

export type GraphEdgeType = [GraphNodeType['address'], GraphNodeType['address'], GraphNodeType['address']]

export type GraphType = {
  hash: string
  nodes: Record<string, GraphNodeType>
  edges: Array<GraphEdgeType>
}

export type ExportType = 'default' | 'named' | 'none'

export type FileNodePayloadType = {
  name: string
  extension: string
  path: string
  relativePath: string
  code: string
  ast: ParseResult
}

export type FileNodeType = Particule<FileNodePayloadType>

export type FunctionNodePayloadType = {
  name: string
  path: string
  relativePath: string
  exportType: ExportType
  isComponent: boolean
}

export type FunctionNodeType = Particule<FunctionNodePayloadType>

export enum HierarchyPositionType {
  before = 'before',
  after = 'after',
  children = 'children',
  parent = 'parent',
}

export type ImportDeclaration = { value: string, specifiers: string[] }
export type ImportDeclarationsRegistry = Record<string, ImportDeclaration[]>

export type HistoryMutationReturnType<T> = {
  returnValue: T
  impactedFileNodes: FileNodeType[]
  description: string
}

export type ImpactedType = {
  fileNode: FileNodeType
  ast: ParseResult
  importDeclarationsRegistry: ImportDeclarationsRegistry
}

export type MutateType = (x: any, previousX: any) => void

export type PostTraverseType = (fileNode: FileNodeType, ast: ParseResult, importDeclarationsRegistry: ImportDeclarationsRegistry) => void

export type IndexRegistryType = Record<string, number>

export type HierarchyTreeType = {
  label: string
  index: number
  onComponentAddress: string
  componentAddress?: string
  hierarchyId?: string
  children: HierarchyTreeType[]
}
