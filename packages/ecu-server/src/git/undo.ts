import { execSync } from 'node:child_process'

import { appPath, ecuCommitPrefix } from '../configuration.js'

import readEcuHistory from '../history/readEcuHistory.js'
import writeEcuHistory from '../history/writeEcuHistory.js'

import possiblyRemoveEcuCommitPrefix from './utils/possiblyRemoveEcuCommitPrefix.js'

async function undo() {
  const branch = `undo-${Date.now()}`
  let message = ''

  try {
    // TODO prevent deleting commits from 3rd parties
    const messageBuffer = execSync('git log -1 --pretty=%B', { cwd: appPath })
    message = messageBuffer.toString().trim()
  }
  catch (error) {
    console.log(error)

    throw new Error('Undo failed (1)')
  }

  if (!message.startsWith(ecuCommitPrefix)) {
    throw new Error('Cannot undo non-ecu commit')
  }

  if (message === `${ecuCommitPrefix}Create ecu project`) {
    throw new Error('End of ecu history')
  }

  try {
    const historyArray = readEcuHistory()

    execSync(`git branch ${branch} && git reset --hard HEAD~1`, { cwd: appPath })
    writeEcuHistory([...historyArray, { branch, message: possiblyRemoveEcuCommitPrefix(message) }])

    return true
  }
  catch (error) {
    console.log(error)

    throw new Error('Undo failed (2)')
  }
}

export default undo
