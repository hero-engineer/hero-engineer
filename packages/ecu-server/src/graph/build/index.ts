import { GraphType } from 'ecu-common'

import buildFilesGraph from './buildFilesGraph'

function buildGraph(graph: GraphType) {
  buildFilesGraph(graph)

  console.log('graph', graph)

  return graph
}

export default buildGraph
