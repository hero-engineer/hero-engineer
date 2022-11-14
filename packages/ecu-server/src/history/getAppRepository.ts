import fs from 'node:fs'

import { findUp } from 'find-up'
import gitUserName from 'git-user-name'
// @ts-expect-error
import gitUserEmail from 'git-user-email-2'

import { appPath } from '../configuration'

const gitDir = '.git'

async function getAppRepository() {
  const dir = await findUp(gitDir, { cwd: appPath, type: 'directory' })
  const name = gitUserName() || ''
  const email = gitUserEmail() || ''

  return {
    fs,
    dir: dir?.slice(0, -gitDir.length) ?? appPath,
    author: {
      name,
      email,
    },
  }
}

export default getAppRepository
