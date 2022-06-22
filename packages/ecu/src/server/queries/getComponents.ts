import { FunctionType } from '../../shared/types'
import graph from '../graph'
import { filterByRole } from '../../shared/graphHelpers'

function getComponents(): FunctionType[] {
  return filterByRole<FunctionType>(graph, 'Function').filter(node => node.isComponent)
}

export default getComponents
