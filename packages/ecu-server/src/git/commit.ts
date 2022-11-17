import { execSync } from 'node:child_process'

import { ecuCommitPrefix } from '../configuration.js'

async function commit(cwd: string, message: string) {
  try {
    execSync(`git add . -A && git commit -m "${ecuCommitPrefix}${message}"`, { cwd })
  }
  catch (error) {
    console.log(error)

    throw new Error('Commit failed!')
  }
}

export default commit
