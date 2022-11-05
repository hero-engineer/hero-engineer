import { FunctionNodeType } from '../../types'

import { getNodesByRole } from '../../graph'

function componentsQuery() {
  return getNodesByRole<FunctionNodeType>('Function').filter(node => node.payload.isComponent)
}

export default componentsQuery
