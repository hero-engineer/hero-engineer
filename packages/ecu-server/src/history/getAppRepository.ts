import fs from 'node:fs'

import { findUp } from 'find-up'

import { appPath } from '../configuration'

const gitDir = '.git'

async function getAppRepository() {
  const dir = await findUp(gitDir, { cwd: appPath, type: 'directory' })

  console.log('dir', dir)

  return {
    fs,
    dir: dir?.slice(0, -gitDir.length) ?? appPath,
  }
}

export default getAppRepository
