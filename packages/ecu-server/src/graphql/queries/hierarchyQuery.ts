import traverseComponent from '../../domain/traversal/traverseComponent'

type HierarchyQueryArgs = {
  sourceComponentAddress: string
}

function hierarchyQuery(_: any, { sourceComponentAddress }: HierarchyQueryArgs) {
  console.log('__hierarchyQuery__')

  return JSON.stringify(traverseComponent(sourceComponentAddress, []))
}

export default hierarchyQuery
