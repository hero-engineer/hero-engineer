function extractIdAndIndex(hierarchyId: string): [string, number] {
  const idArray = hierarchyId.split(':')
  const index = idArray.pop()

  return [idArray.join(':') || '', parseInt(index || '') as number]
}

export default extractIdAndIndex
