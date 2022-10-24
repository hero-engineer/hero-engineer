import { GraphType } from '../../types'

import createHierachyIds from '../../watchers/createHierarchyIds'

import buildFilesGraph from './buildFilesGraph'

async function buildGraph(graph: GraphType) {
  buildFilesGraph(graph)

  console.log('graph', Object.keys(graph.nodes).length)

  await createHierachyIds(graph)

  return graph
}

export default buildGraph
