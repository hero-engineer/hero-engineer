import getGlobalTypes from '../../domain/types/getGlobalTypes.js'

function globalTypesQuery() {
  const { globalTypesFileContent } = getGlobalTypes()

  // console.log('hierarchy', JSON.stringify(hierarchy, null, 2))

  return {
    globalTypesFileContent,
  }
}

export default globalTypesQuery
