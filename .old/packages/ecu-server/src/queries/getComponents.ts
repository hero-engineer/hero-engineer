import { FunctionType } from '../../shared/types'
import graph from '../graph'
import { getNodesByRole } from '../../shared/graphHelpers'

function getComponents(): FunctionType[] {
  return getNodesByRole<FunctionType>(graph, 'Function').filter(node => node.workload.isComponent)
}

export default getComponents
