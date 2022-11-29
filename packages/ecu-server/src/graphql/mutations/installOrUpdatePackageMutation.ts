import { execSync } from 'node:child_process'

import { PackageType } from '../../types.js'
import { appPath } from '../../configuration.js'

import commit from '../../git/commit.js'

import addToExecQueue from '../../exec/addToExecQueue.js'

type InstallOrUpdatePackageMutationArgsType = PackageType & {
  shouldDelete: boolean
}

function createExecQueueHandler(cmd: string, commitMessage: string) {
  return async () => {
    execSync(cmd, { cwd: appPath, stdio: 'inherit' })

    await commit(appPath, commitMessage)

    return true
  }
}

async function installOrUpdatePackageMutation(_: any, { name, version, type, shouldDelete }: InstallOrUpdatePackageMutationArgsType) {
  console.log('__installOrUpdatePackageMutation__')

  if (shouldDelete) return addToExecQueue(createExecQueueHandler(`npm uninstall ${name}`, `Uninstall ${name} package`))
  if (!version) return addToExecQueue(createExecQueueHandler(`npm install --save${type === 'devDependencies' ? '-dev' : ''} ${name}`, `Install ${name} package in ${type}`))

  return addToExecQueue(createExecQueueHandler(`npm install --save${type === 'devDependencies' ? '-dev' : ''} ${name}@${version}`, `Update ${name} package to ${version}`))
}

export default installOrUpdatePackageMutation
