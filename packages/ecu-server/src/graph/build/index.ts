import { GraphType } from '../../types'

import createHierachyIds from '../../watchers/createHierarchyIds'

import buildFilesGraph from './buildFilesGraph'

function buildGraph(graph: GraphType) {
  buildFilesGraph(graph)

  console.log('graph', Object.keys(graph.nodes).length)

  createHierachyIds(graph)

  return graph
}

export default buildGraph
