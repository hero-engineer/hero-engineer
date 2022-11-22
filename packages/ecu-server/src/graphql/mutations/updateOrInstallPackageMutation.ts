import { PackageType } from '../../types.js'

import addToExecQueue from '../../exec/addToExecQueue.js'

type UpdatePackageMutationArgsType = {
  package: PackageType
  shouldDelete: boolean
}

async function updateOrInstallPackageMutation(_: any, { package: pkg, shouldDelete }: UpdatePackageMutationArgsType) {
  console.log('__updateOrInstallPackageMutation__')

  const { name, version, type } = pkg

  if (shouldDelete) {
    return addToExecQueue(`npm uninstall ${name}`, `Uninstall ${name} package`)
  }

  if (!version) {
    return addToExecQueue(`npm install --save${type === 'devDependencies' ? '-dev' : ''} ${name}`, `Install ${name} package in ${type}`)
  }

  return addToExecQueue(`npm install --save${type === 'devDependencies' ? '-dev' : ''} ${name}@${version}`, `Update ${name} package to ${version}`)
}

export default updateOrInstallPackageMutation
