import { GraphType } from '../../types'

import createHierachyIdsAndKeysWatcher from '../../watchers/createHierarchyIdsAndKeysWatcher'

import buildFilesGraph from './buildFilesGraph'

async function buildGraph(graph: GraphType) {
  buildFilesGraph(graph)

  console.log('graph', Object.keys(graph.nodes).length)

  await createHierachyIdsAndKeysWatcher(graph)

  return graph
}

export default buildGraph
