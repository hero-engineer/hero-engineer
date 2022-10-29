import createDataEcuAttributesWatcher from '../../watchers/createDataEcuAttributesWatcher'

import { deleteGraph } from '..'
import { getGraph } from '../getset'
import getAppHash from '../hash/getAppHash'

import updateGraphHash from '../hash/updateGraphHash'

import buildFilesGraph from './buildFilesGraph'

async function buildGraph() {
  const hash = await getAppHash()

  if (getGraph().hash !== hash) {
    console.log('App hash has changed, rebuilding graph')

    deleteGraph()
    buildFilesGraph()

    await createDataEcuAttributesWatcher()
    await updateGraphHash()
  }

  console.log('graph', Object.keys(getGraph().nodes).length)
}

export default buildGraph
