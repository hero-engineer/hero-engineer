import traverseComponent from '../../domain/traversal/traverseComponent'

type HierarchyQueryArgs = {
  sourceComponentAddress: string
}

function hierarchyQuery(_: any, { sourceComponentAddress }: HierarchyQueryArgs) {
  console.log('__hierarchyQuery__')

  const hierarchy = traverseComponent(sourceComponentAddress, [])

  return JSON.stringify(hierarchy)
}

export default hierarchyQuery
