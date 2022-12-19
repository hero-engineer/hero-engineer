import { execSync } from 'node:child_process'

import possiblyRemoveCommitPrefix from './utils/possiblyRemoveCommitPrefix.js'

function getLastGitMessage() {
  return possiblyRemoveCommitPrefix(execSync('git log -1 --pretty=%B').toString().trim())
}

export default getLastGitMessage
