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
  componentAddress?: string
  hierarchyId?: string
  isRoot: boolean
  isChild: boolean
  isComponentAcceptingChildren: boolean
  children: HierarchyItemType[]
}

export type TypeType = {
  name: string
  declaration: string
  fileNodeAddress: string
}

export type ImportSpecifierType = 'ImportDefaultSpecifier' | 'ImportNamespaceSpecifier' | 'ImportSpecifier'

export type ImportType = {
  name: string
  source: string
  type: ImportSpecifierType
}

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
  name: string
  min: number
  max: number
  base: number
  scale: number
}

export type CssAttributeType = {
  name: string
  value: string
}

export type CssClassType= {
  selector: string
  declaration: string
  attributes: CssAttributeType[]
}

export type SpacingType = number | string

export type SpacingsType = [SpacingType, SpacingType, SpacingType, SpacingType]
