import { addNode } from 'ecu-common'

import { plugins } from './configuration'
import graph from './graph'
import buildGraph from './graph/build'

console.log('plugins', plugins)
plugins.forEach(particule => addNode(graph, particule))
buildGraph(graph)
