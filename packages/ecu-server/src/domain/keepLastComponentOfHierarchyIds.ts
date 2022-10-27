import extractIdAndIndex from './extractIdAndIndex'

function keepLastComponentOfHierarchyIds(hierarchyIds: string[], n: number) {
  const array = [...hierarchyIds].reverse()
  const ids: string[] = [array.shift() as string]
  let counter = 1

  array.forEach(hierarchyId => {
    if (counter > n) {
      return
    }

    const [lastComponentId] = extractIdAndIndex(ids[ids.length - 1])
    const [componentId] = extractIdAndIndex(hierarchyId)

    if (extractIdAndIndex(lastComponentId)[0] !== extractIdAndIndex(componentId)[0]) {
      counter++

      if (counter > n) {
        return
      }
    }

    ids.push(hierarchyId)
  })

  return ids.reverse()
}

export default keepLastComponentOfHierarchyIds
