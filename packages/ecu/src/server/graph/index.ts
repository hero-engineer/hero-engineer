import { GraphType } from '../../types'

import buildFilesGraph from './buildFilesGraph'

const graph: GraphType = {
  nodes: {},
  triplets: [],
}

buildFilesGraph(graph)

export default graph
