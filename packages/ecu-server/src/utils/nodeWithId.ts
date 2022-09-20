import { GraphNodeType } from 'ecu-common'

function nodeWithId(node: GraphNodeType, other = {}) {
  return {
    id: node.address,
    ...node.payload,
    ...other,
  }
}

export default nodeWithId
