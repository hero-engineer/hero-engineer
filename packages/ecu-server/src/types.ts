import {
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  JSXText,
} from '@babel/types'
import { NodePath, ParseResult } from '@babel/core'

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

export type ExportType = 'Default' | 'Named' | 'None'

export type FileNodePayloadType = {
  name: string
  extension: string
  path: string
  relativePath: string
  code: string
  ast: ParseResult | null
  description: string
  emoji: string
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

export type ImportSpecifierType = 'ImportDefaultSpecifier' | 'ImportNamespaceSpecifier' | 'ImportSpecifier'

export type ImportType = {
  source: string
  name: string
  type: ImportSpecifierType
}

export type ImportsRegistry = Record<string, ImportType[]>

export type HistoryMutationReturnType<T> = {
  returnValue: T
  description: string
}

export type ImpactedType = {
  fileNode: FileNodeType
  ast: ParseResult
}

export type MutateType = (x: any, previousX: any) => void

export type PostTraverseType = (fileNode: FileNodeType, ast: ParseResult) => void

export type IndexRegistryType = Record<string, number>

export type HierarchyTreeType = {
  id: string
  label: string
  displayName: string
  index: number
  fileAddress: string
  fileEmoji: string
  componentName: string
  onComponentAddress: string
  componentAddress: string
  hierarchyId: string
  isRoot: boolean
  isChild: boolean
  isComponentAcceptingChildren: boolean
  children: HierarchyTreeType[]
}

export type TypeType = {
  name: string
  declaration: string
  fileNodeAddress: string
}

export type EcuHistoryEntryType = {
  branch: string
  message: string
}

export type AtomType = {
  id: string
  name: string
  defaultClassName: string
  isComponentAcceptingChildren: boolean
  defaultChildren: (JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement | JSXFragment)[]
}

export type TraverseComponentOnSuccessType = (paths: NodePath<JSXElement>[]) => void

export type PackageType = {
  name: string
  version: string
  type: 'dependencies' | 'devDependencies'
}

export type CssValueType = string | number

export type CssAttributeType = {
  name: string
  value: CssValueType
}

export type CssClassType = {
  selector: string
  declaration: string
  attributes: CssAttributeType[]
}
