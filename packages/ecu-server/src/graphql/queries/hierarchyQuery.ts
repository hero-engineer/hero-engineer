import traverseComponent from '../../domain/components/traverseComponent.js'

type HierarchyQueryArgs = {
  sourceComponentAddress: string
}

function hierarchyQuery(_: any, { sourceComponentAddress }: HierarchyQueryArgs) {
  console.log('__hierarchyQuery__')

  // TODO remove try catch
  try {
    const { hierarchy } = traverseComponent(sourceComponentAddress)

    return JSON.stringify(hierarchy)
  }
  catch (error) {
    console.log('error', error)
  }

  // console.log('hierarchy', JSON.stringify(hierarchy, null, 2))
  return ''
}

export default hierarchyQuery
