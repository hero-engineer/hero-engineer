import fs from 'node:fs'

import { findUp } from 'find-up'

import { appPath } from '../configuration'

async function getAppRepository() {
  const gitDir = await findUp('.git', { cwd: appPath, type: 'directory' })

  console.log('gitDir', gitDir)

  return {
    fs,
    dir: appPath,
    gitDir,
  }
}

export default getAppRepository
