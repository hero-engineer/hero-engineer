import { GraphEdgeType, GraphNodeType, GraphType } from '../../types'

export function getNodeById(graph: GraphType, id: string) {
  return graph.nodes[id]
}

export function addNode(graph: GraphType, node: GraphNodeType): void {
  graph.nodes[node.id] = node
}

export function addEdge(graph: GraphType, edge: GraphEdgeType): void {
  graph.edges.push(edge)
}

export function removeNode(graph: GraphType, nodeId: string): void {
  delete graph.nodes[nodeId]

  graph.edges = graph.edges.filter(edge => (edge[0] !== nodeId && edge[2] !== nodeId))
}

export function removeEdge(graph: GraphType, edge: GraphEdgeType): void {
  graph.edges = graph.edges.filter(e => edge.every((x, i) => x === e[i]))
}

export function filterByType<T extends GraphNodeType>(graph: GraphType, type: string) {
  return Object.values(graph.nodes).filter(node => node.type === type) as T[]
}
