import { FunctionNodeType } from '../../types'

import { getNodesByRole } from '../../graph'

function getComponents() {
  return getNodesByRole<FunctionNodeType>('Function').filter(node => node.payload.isComponent)
}

export default getComponents
