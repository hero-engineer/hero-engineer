import readPackagesUpdates from '../../domain/packages/readPackagesUpdates.js'

function packagesUpdatesQuery() {
  console.log('__packagesUpdatesQuery__')

  return readPackagesUpdates()
}

export default packagesUpdatesQuery
