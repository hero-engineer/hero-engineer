export type HierarchyPosition = 'before' | 'after' | 'children' | 'parent'

export type HierarchyItemType = {
  label: string
  componentName: string
  componentAddress?: string
  hierarchyId?: string
}
