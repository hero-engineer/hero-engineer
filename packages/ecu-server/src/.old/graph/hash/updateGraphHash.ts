import { setHash } from '../index.js'

import getAppHash from './getAppHash.js'

async function updateGraphHash() {
  console.log('Updating graph hash')

  const hash = await getAppHash()

  setHash(hash)
}

export default updateGraphHash
