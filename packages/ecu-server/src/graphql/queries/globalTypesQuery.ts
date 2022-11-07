import getGlobalTypes from '../../domain/types/getGlobalTypes'

function globalTypesQuery() {
  console.log('__globalTypesQuery__')

  const { globalTypesFileContent } = getGlobalTypes()

  // console.log('hierarchy', JSON.stringify(hierarchy, null, 2))

  return {
    globalTypesFileContent,
  }
}

export default globalTypesQuery
