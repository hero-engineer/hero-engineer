export type XYType = {
  x: number
  y: number
}

export type HierarchyPosition = 'before' | 'after' | 'children' | 'parent'

export type HierarchyItemType = {
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
