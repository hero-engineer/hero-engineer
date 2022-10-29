import { GraphEdgeType, GraphNodeType, GraphType } from '../types'

import { getGraph, setGraph } from './getset'

/* --
  * GETTERS
-- */

export function getNodeByAddress<T extends GraphNodeType>(address: string) {
  const graph = getGraph()

  return graph.nodes[address] as T
}

export function getNodesByRole<T extends GraphNodeType>(role: string) {
  const graph = getGraph()

  return Object.values(graph.nodes).filter(node => node.role === role) as T[]
}

export function getNodesByFirstNeighbourg<T extends GraphNodeType>(nodeId: string, edgeName: string) {
  const graph = getGraph()

  const edges = graph.edges.filter(edge => edge[0] === nodeId && edge[1] === edgeName)

  return edges.map(edge => graph.nodes[edge[2]]) as T[]
}

export function getNodesBySecondNeighbourg<T extends GraphNodeType>(nodeId: string, edgeName: string) {
  const graph = getGraph()

  const edges = graph.edges.filter(edge => edge[2] === nodeId && edge[1] === edgeName)

  return edges.map(edge => graph.nodes[edge[0]]) as T[]
}

export function findNodes<T extends GraphNodeType>(predicate: (node: T) => boolean) {
  const graph = getGraph()

  return Object.values(graph.nodes).filter(predicate as any) as T[]
}

export function findNode<T extends GraphNodeType>(predicate: (node: T) => boolean) {
  const graph = getGraph()

  return Object.values(graph.nodes).find(predicate as any) as T
}

/* --
  * SETTERS
-- */

export function deleteGraph() {
  setGraph({
    hash: '',
    nodes: {},
    edges: [],
  })
}

export function setHash(hash: string) {
  const graph = getGraph()

  graph.hash = hash

  setGraph(graph)
}

export function addNode(node: GraphNodeType) {
  const graph = getGraph()

  graph.nodes[node.address] = node

  setGraph(graph)
}

export function addEdge(edge: GraphEdgeType) {
  const graph = getGraph()

  graph.edges.push(edge)

  setGraph(graph)
}

export function removeNode(nodeId: string) {
  const graph = getGraph()

  delete graph.nodes[nodeId]

  graph.edges = graph.edges.filter(edge => (edge[0] !== nodeId && edge[2] !== nodeId))

  setGraph(graph)
}

export function removeEdge(edge: GraphEdgeType) {
  const graph = getGraph()

  graph.edges = graph.edges.filter(e => edge.every((x, i) => x === e[i]))

  setGraph(graph)
}
