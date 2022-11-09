export type HierarchyPosition = 'before' | 'after' | 'children' | 'parent'

export type HierarchyItemType = {
  label: string
  index: number
  fileAddress: string
  componentName: string
  onComponentAddress: string
  componentAddress?: string
  hierarchyId?: string
  children: HierarchyItemType[]
}

export type TypeType = {
  name: string
  declaration: string
  fileNodeAddress: string
}
