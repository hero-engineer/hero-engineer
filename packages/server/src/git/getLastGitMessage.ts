import { execSync } from 'node:child_process'

import possiblyRemoveEcuCommitPrefix from './utils/possiblyRemoveEcuCommitPrefix.js'

function getLastGitMessage() {
  return possiblyRemoveEcuCommitPrefix(execSync('git log -1 --pretty=%B').toString().trim())
}

export default getLastGitMessage
