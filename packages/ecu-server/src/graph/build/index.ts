import { GraphType } from 'ecu-common'

import createHierachyId from '../../watchers/createHierarchyId'

import buildFilesGraph from './buildFilesGraph'

function buildGraph(graph: GraphType) {
  buildFilesGraph(graph)

  console.log('graph', Object.keys(graph.nodes).length)

  createHierachyId(graph)

  return graph
}

export default buildGraph
