import readPackages from '../../packages/readPackages.js'

function packagesQuery() {
  console.log('__packagesQuery__')

  return readPackages()
}

export default packagesQuery
