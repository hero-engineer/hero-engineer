import { execSync } from 'node:child_process'

import { appPath, commitPrefix, initialCommitMessage } from '../configuration.js'

import readHistory from '../history/readHistory.js'
import writeHistory from '../history/writeHistory.js'

import possiblyRemoveCommitPrefix from './utils/possiblyRemoveCommitPrefix.js'

async function undo() {
  const branch = `undo-${Date.now()}`
  let message = ''

  try {
    const messageBuffer = execSync('git log -1 --pretty=%B', { cwd: appPath })
    message = messageBuffer.toString().trim()
  }
  catch (error) {
    console.log(error)

    throw new Error('Undo failed (1)')
  }

  if (!message.startsWith(commitPrefix)) {
    throw new Error('Cannot undo non-Hero Engineer commit')
  }

  if (message === commitPrefix + initialCommitMessage) {
    throw new Error('End of Hero Engineer commit history')
  }

  try {
    const historyArray = readHistory()

    execSync(`git branch ${branch} && git reset --hard HEAD~1`, { cwd: appPath })
    writeHistory([...historyArray, { branch, message: possiblyRemoveCommitPrefix(message) }])

    return true
  }
  catch (error) {
    console.log(error)

    throw new Error('Undo failed (2)')
  }
}

export default undo
