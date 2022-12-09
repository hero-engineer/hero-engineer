export type FunctionNodeType = {
  address: string
  payload: {
    name: string
    path: string
    relativePath: string
  }
}

export type FileNodeType = {
  address: string
  payload: {
    name: string
    path: string
    relativePath: string
    emoji: string
    description: string
  }
}

export type RectType = {
  x: number
  y: number
  width: number
  height: number
}

export type HierarchyPosition = 'before' | 'after' | 'children' | 'parent'

export type HierarchyItemType = {
  id: string
  label: string
  displayName: string
  index: number
  fileAddress: string
  fileEmoji: string
  componentName: string
  onComponentAddress: string
  onComponentName: string
  componentAddress?: string
  hierarchyId?: string
  isRoot: boolean
  isChild: boolean
  isComponentAcceptingChildren: boolean
  isComponentEditable: boolean
  children: HierarchyItemType[]
}

export type TypeType = {
  name: string
  declaration: string
  fileNodeAddress: string
}

export type ImportSpecifierType = 'ImportDefaultSpecifier' | 'ImportNamespaceSpecifier' | 'ImportSpecifier'

// export type ImportType = {
//   name: string
//   source: string
//   type: ImportSpecifierType
// }

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

export type CssValuesType = Record<string, CssValueType>

export type CssAttributeType = {
  name: string
  value: CssValueType
}

export type CssClassType= {
  selector: string
  declaration: string
  attributes: CssAttributeType[]
  media: string
}

export type CSsAttributesMapType = Record<string, {
  attributes: readonly string[]
  defaultValue: CssValueType
  extractValue?: (value: CssValueType) => CssValueType
  converter?: (value: CssValueType) => CssValuesType
  isValueValid: (value: CssValueType) => boolean
}>

export type FontType = {
  id: string
  name: string
  url: string
  weights: number[]
  isVariable: boolean
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

export type XYType = {
  x: number
  y: number
}

// full-ast

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
  start: number
  element: HTMLElement | null
  childrenElements: HTMLElement[]
  childrenElementsStack: HTMLElement[]
  children: HierarchyType[]
}

export type ImportType = {
  type: 'default' | 'named'
  source: string
  name: string
}

export type ExportType = {
  type: 'default' | 'named'
  name: string
}
