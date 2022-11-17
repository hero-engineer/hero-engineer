import createDataEcuAttributesWatcher from '../../watchers/createDataEcuAttributesWatcher.js'
import deleteAllScreenshots from '../../watchers/deleteAllScreenshots.js'

import { deleteGraph } from '../index.js'
import { getGraph } from '../getset.js'
import getAppHash from '../hash/getAppHash.js'

import updateGraphHash from '../hash/updateGraphHash.js'

import buildFilesGraph from './buildFilesGraph.js'

async function buildGraph() {
  const hash = await getAppHash()

  if (getGraph().hash !== hash) {
    console.log('App hash has changed, rebuilding graph')

    deleteGraph()
    buildFilesGraph()
    deleteAllScreenshots()

    await createDataEcuAttributesWatcher()
    await updateGraphHash()
  }

  console.log('graph', Object.keys(getGraph().nodes).length)
}

export default buildGraph
