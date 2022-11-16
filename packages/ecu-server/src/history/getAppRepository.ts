import fs from 'node:fs'

import { findUp } from 'find-up'

import getGitAuthor from './getGitAuthor.js'

const gitDir = '.git'

async function getAppRepository(cwd: string) {
  const { name, email } = getGitAuthor()
  const dir = await findUp(gitDir, { cwd, type: 'directory' })

  return {
    fs,
    dir: dir?.slice(0, -gitDir.length) ?? cwd,
    author: {
      name,
      email,
    },
  }
}

export default getAppRepository
