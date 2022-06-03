import { GraphType } from '../../types'

import buildFilesGraph from './buildFilesGraph'
import buildDependenciesGraph from './buildDependenciesGraph'
import buildFunctionsGraph from './buildFunctionsGraph'
import buildComponentsGraph from './buildComponentsGraph'
import buildExportsGraph from './buildExportsGraph'

const graph: GraphType = {
  nodes: {},
  triplets: [],
}

buildFilesGraph(graph)
buildDependenciesGraph(graph)
buildFunctionsGraph(graph)
buildComponentsGraph(graph)
buildExportsGraph(graph)

export default graph
