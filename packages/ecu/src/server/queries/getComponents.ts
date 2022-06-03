import { FunctionType } from '../../types'
import graph from '../graph'
import { filterByType } from '../graph/helpers'

function getComponents(): FunctionType[] {
  console.log('xxx', filterByType<FunctionType>(graph, 'Function').filter(node => node.isComponent))

  return filterByType<FunctionType>(graph, 'Function').filter(node => node.isComponent)
}

export default getComponents
