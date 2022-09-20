import { GraphType } from 'ecu-common'

import buildFilesGraph from './buildFilesGraph'

function buildGraph(graph: GraphType) {
  buildFilesGraph(graph)

  console.log('graph', Object.keys(graph.nodes).length)

  return graph
}

export default buildGraph
