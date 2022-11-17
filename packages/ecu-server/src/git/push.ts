import { execSync } from 'node:child_process'

import { appPath, ecuCommitPrefix } from '../configuration.js'

function push() {
  try {
    const currentBranchBuffer = execSync('git branch --show-current', { cwd: appPath })
    const currentBranch = currentBranchBuffer.toString().trim()

    // If we're on an undo branch
    if (currentBranch !== 'main') {
      execSync(`git checkout main' && git merge ${currentBranch} -X theirs -m "${ecuCommitPrefix}Merge ${currentBranch} into main before push"`, { cwd: appPath })
    }

    try {
      execSync('git push', { cwd: appPath })
    }
    catch (error) {
      console.log('Cannot git push, trying with --force')

      execSync('git push --force', { cwd: appPath })
    }

    return true
  }
  catch (error) {
    console.log(error)

    throw new Error('Push failed!')
  }
}

export default push
