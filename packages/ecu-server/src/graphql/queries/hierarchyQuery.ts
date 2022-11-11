import traverseComponent from '../../domain/components/traverseComponent'

type HierarchyQueryArgs = {
  sourceComponentAddress: string
}

function hierarchyQuery(_: any, { sourceComponentAddress }: HierarchyQueryArgs) {
  console.log('__hierarchyQuery__')

  const { hierarchy } = traverseComponent(sourceComponentAddress, [])

  // console.log('hierarchy', JSON.stringify(hierarchy, null, 2))

  return JSON.stringify(hierarchy)
}

export default hierarchyQuery
