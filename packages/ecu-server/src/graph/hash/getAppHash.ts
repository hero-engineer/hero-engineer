import { hashElement } from 'folder-hash'

import { appPath } from '../../configuration.js'

async function getAppHash() {
  const results = await hashElement(appPath, {
    folders: {
      exclude: ['.*', 'node_modules', 'test_coverage'],
    },
    files: {
      include: ['*.ts', '*.tsx'],
    },
  })

  console.log('App hash', results.hash)

  return results.hash
}

export default getAppHash
