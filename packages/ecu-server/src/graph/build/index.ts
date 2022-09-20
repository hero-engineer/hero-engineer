import { GraphType } from 'ecu-common'

import buildFilesGraph from './buildFilesGraph'

function buildGraph(graph: GraphType) {
  buildFilesGraph(graph)

  return graph
}

export default buildGraph
