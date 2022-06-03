import { GraphNodeType, GraphType } from '../../types'

export function filterByType<T extends GraphNodeType>(graph: GraphType, type: string) {
  return Object.values(graph.nodes).filter(node => node.type === type) as T[]
}
