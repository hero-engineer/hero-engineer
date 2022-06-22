import path from 'path'

import { Particule } from 'ecu-particule'

import { GraphType } from './types'
import configuration from './configuration'
import { addEdge, addNode } from './graphHelpers'

function registerPlugins(graph: GraphType) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const particules = require(path.join(configuration.configurationPath, 'plugins.js')) as Particule[]

  particules.forEach(particule => addNode(graph, particule))

  return graph
}

export default registerPlugins
