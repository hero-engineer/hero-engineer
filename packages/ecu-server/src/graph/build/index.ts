import { GraphType } from '../../types'

import createDataEcuAttributesWatcher from '../../watchers/createDataEcuAttributesWatcher'

import buildFilesGraph from './buildFilesGraph'

async function buildGraph(graph: GraphType) {
  buildFilesGraph(graph)

  await createDataEcuAttributesWatcher(graph)

  console.log('graph', Object.keys(graph.nodes).length)

  return graph
}

export default buildGraph
