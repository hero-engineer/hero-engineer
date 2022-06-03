import { GraphType } from '../../types'

import buildGraph from './build'

const graph: GraphType = {
  nodes: {},
  edges: [],
}

buildGraph(graph)

export default graph
