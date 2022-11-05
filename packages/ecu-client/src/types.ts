export type HierarchyPosition = 'before' | 'after' | 'children' | 'parent'

export type HierarchyItemType = {
  label: string
  index: number
  componentName: string
  onComponentAddress: string
  componentAddress?: string
  hierarchyId?: string
  children: HierarchyItemType[]
}
