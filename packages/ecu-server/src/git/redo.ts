import { execSync } from 'node:child_process'

import { appPath } from '../configuration.js'

import popEcuHistory from '../history/popEcuHistory.js'

function redo() {
  const historyItem = popEcuHistory()

  if (!historyItem) {
    console.log('Nothing to redo')

    return false
  }

  const { branch } = historyItem

  try {
    execSync(`git add . -A && git merge ${branch} -X theirs --no-commit && git branch -D ${branch}`, { cwd: appPath })

    return true
  }
  catch (error) {
    console.log(error)

    throw new Error('Redo failed!')
  }
}

export default redo
