import fs from 'node:fs'

import { findUp } from 'find-up'

import { appPath } from '../configuration'

async function getAppRepository() {
  return {
    fs,
    dir: appPath,
    gitDir: await findUp('.git', { cwd: appPath, type: 'directory' }),
  }
}

export default getAppRepository
