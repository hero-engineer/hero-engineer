export type HierarchyPosition = 'before' | 'after' | 'within' | 'children' | 'parent'

export type HierarchyItemType = {
  label: string
  componentName: string
  componentAddress?: string
  hierarchyId?: string
}
