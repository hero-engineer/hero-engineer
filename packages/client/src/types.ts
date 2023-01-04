import { JsxChild, Node as TsNode } from 'ts-morph'

export type SnackBarItemType = {
  id: number
  content: string
  severity: 'success' | 'info' | 'warning' | 'error'
  actionLinkTo?: string
  cleared?: boolean
}

export type PackageType = {
  name: string
  version: string
  type: 'dependencies' | 'devDependencies'
}

export type BreakpointType = {
  id: string
  name: string
  min: number
  max: number
  base: number
  scale: number
  media: string
}

export type CssValueType = string | number

export type CssAttributeType = {
  cssName: string
  jsName: string
  value: CssValueType
  isImportant: boolean
  comment: string
}

export type CssClassType = {
  id: string
  selector: string
  declaration: string
  attributes: CssAttributeType[]
  media: string
}

export type CSsAttributesMapType = Record<string, {
  cssNames: readonly string[]
  defaultValue: CssValueType
  // extractValue?: (value: CssValueType) => CssValueType
  isValueValid: (value: CssValueType) => boolean
  converter?: (value: CssValueType, isImportant: boolean) => CssAttributeType[]
}>

export type TypefaceType = {
  name: string
  url: string
  weights: number[]
  isVariable: boolean
}

export type CssVariableTypeType = 'color' | 'spacing' | 'other'

export type CssVariableType ={
  id: string
  type: CssVariableTypeType
  name: string
  value: string
}

export type ColorType ={
  id: string
  variableName: string
  name: string
  value: string
}

export type SpacingType ={
  id: string
  variableName: string
  name: string
  value: string
}

export type FileType = {
  path: string
  code: string
}

export type TabType = {
  url: string
  label: string
}

export type HierarchyType = {
  id: string
  name: string
  type: 'component' | 'element' | 'text' | 'array' | 'children'
  start: number
  element: HTMLElement | null
  children: HierarchyType[]
  onFilePath: string
  cursors: number[]
}

export type ExtendedHierarchyContextType = {
  id: string
  previousTopJsxIds: string[]
  childIndex: number,
  children: JsxChild[]
  imports: ImportType[]
  identifiers: IdentifierType[]
  childrenOnFilePath: string
}

export type ExtendedHierarchyType = Omit<HierarchyType, 'children' | 'cursors'> & {
  children: ExtendedHierarchyType[]
  childrenElements: HTMLElement[]
  childrenElementsStack: HTMLElement[]
  context: ExtendedHierarchyContextType
}

export type ImportType = {
  type: 'default' | 'named'
  source: string
  name: string
  sourceFilePath: string
}

export type ExportType = {
  type: 'default' | 'named'
  name: string
}

export type IdentifierType = {
  name: string
  value: TsNode,
}

export type LogsType = {
  typescript: boolean
  css: boolean
}

export type NormalizedCssAttributesType = Record<string, CssAttributeType>

export type WarningsType = {
  cssClassOrdering: boolean
}

export type FileTreeType = {
  path: string
  fullPath: string
  children: FileTreeType[]
}

export type NodeDragItemType = {
  cursors: number[]
}

export type InsertedNodeDragItemType = {
  type: 'html-tag'
  name: string
}

export type HierarchyDragType = {
  type: 'hierarchy',
  hierarchyId: string
}

export type HtmlTagDragType = {
  type: 'html-tag',
  name: string
}

export type DragType = HierarchyDragType | HtmlTagDragType
