import { GraphType } from '../../types'

export function filterByType(graph: GraphType, type: string) {
  return Object.values(graph.nodes).filter(node => node.type === type)
}
