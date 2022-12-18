import { hashElement } from 'folder-hash'

import { allowedExtensions, appPath } from '../../configuration.js'

async function getAppHash() {
  const results = await hashElement(appPath, {
    folders: {
      exclude: ['.*', 'node_modules', 'test_coverage'],
    },
    files: {
      include: allowedExtensions.map(extension => `*.${extension}`),
    },
  })

  return results.hash
}

export default getAppHash
