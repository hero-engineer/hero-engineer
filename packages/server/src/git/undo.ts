import { execSync } from 'node:child_process'

import { appPath, commitPrefix } from '../configuration.js'

import readHeroEngineerHistory from '../history/readHeroEngineerHistory.js'
import writeHeroEngineerHistory from '../history/writeHeroEngineerHistory.js'

import possiblyRemoveHeroEngineerCommitPrefix from './utils/possiblyRemoveHeroEngineerCommitPrefix.js'

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

  if (!message.startsWith(commitPrefix)) {
    throw new Error('Cannot undo non-Hero Engineer commit')
  }

  if (message === `${commitPrefix}Create Hero Engineer project`) {
    throw new Error('End of Hero Engineer history')
  }

  try {
    const historyArray = readHeroEngineerHistory()

    execSync(`git branch ${branch} && git reset --hard HEAD~1`, { cwd: appPath })
    writeHeroEngineerHistory([...historyArray, { branch, message: possiblyRemoveHeroEngineerCommitPrefix(message) }])

    return true
  }
  catch (error) {
    console.log(error)

    throw new Error('Undo failed (2)')
  }
}

export default undo
