import { FunctionNodeType } from '../../types'

import graph from '../../graph'
import { getNodesByRole } from '../../graph/helpers'

function getComponents() {
  return getNodesByRole<FunctionNodeType>(graph, 'Function').filter(node => node.payload.isComponent)
}

export default getComponents
