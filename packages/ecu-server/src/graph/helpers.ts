import { GraphEdgeType, GraphNodeType, GraphType } from '../types'

export function getNodeByAddress<T extends GraphNodeType>(graph: GraphType, address: string) {
  return graph.nodes[address] as T
}

export function addNode(graph: GraphType, node: GraphNodeType) {
  graph.nodes[node.address] = node
}

export function addEdge(graph: GraphType, edge: GraphEdgeType) {
  graph.edges.push(edge)
}

export function removeNode(graph: GraphType, nodeId: string) {
  delete graph.nodes[nodeId]

  graph.edges = graph.edges.filter(edge => (edge[0] !== nodeId && edge[2] !== nodeId))
}

export function removeEdge(graph: GraphType, edge: GraphEdgeType) {
  graph.edges = graph.edges.filter(e => edge.every((x, i) => x === e[i]))
}

export function getNodeById<T extends GraphNodeType>(graph: GraphType, id: string) {
  return graph.nodes[id] as T
}

export function getNodesByRole<T extends GraphNodeType>(graph: GraphType, role: string) {
  return Object.values(graph.nodes).filter(node => node.role === role) as T[]
}

export function getNodesByFirstNeighbourg<T extends GraphNodeType>(graph: GraphType, nodeId: string, edgeName: string) {
  const edges = graph.edges.filter(edge => edge[0] === nodeId && edge[1] === edgeName)

  return edges.map(edge => graph.nodes[edge[2]]) as T[]
}

export function getNodesBySecondNeighbourg<T extends GraphNodeType>(graph: GraphType, nodeId: string, edgeName: string) {
  const edges = graph.edges.filter(edge => edge[2] === nodeId && edge[1] === edgeName)

  return edges.map(edge => graph.nodes[edge[0]]) as T[]
}

export function findNodes<T extends GraphNodeType>(graph: GraphType, predicate: (node: T) => boolean) {
  return Object.values(graph.nodes).filter(predicate as any) as T[]
}

export function findNode<T extends GraphNodeType>(graph: GraphType, predicate: (node: T) => boolean) {
  return Object.values(graph.nodes).find(predicate as any) as T
}
