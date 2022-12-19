import { execSync } from 'node:child_process'

import { commitPrefix } from '../configuration.js'

async function commit(cwd: string, message: string) {
  try {
    execSync(`git add . -A && git commit --allow-empty -m "${commitPrefix}${message}"`, { cwd, stdio: 'inherit' })
  }
  catch (error) {
    console.log(error)

    throw new Error('Commit failed!')
  }
}

export default commit
