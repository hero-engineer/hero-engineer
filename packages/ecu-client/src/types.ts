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

export type XYType = {
  x: number
  y: number
}

export type HierarchyPosition = 'before' | 'after' | 'children' | 'parent'

export type HierarchyItemType = {
  id: string
  label: string
  index: number
  fileAddress: string
  componentName: string
  onComponentAddress: string
  componentAddress?: string
  hierarchyId?: string
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
