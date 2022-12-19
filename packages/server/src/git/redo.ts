import { execSync } from 'node:child_process'

import { appPath } from '../configuration.js'

import popHistory from '../history/popHistory.js'

function redo() {
  const historyItem = popHistory()

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
