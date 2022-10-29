import { setHash } from '..'

import getAppHash from './getAppHash'

async function updateGraphHash() {
  console.log('Updating graph hash')

  const hash = await getAppHash()

  setHash(hash)
}

export default updateGraphHash
