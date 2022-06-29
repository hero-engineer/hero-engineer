import { getNodesByRole } from 'ecu-common'

import graph from '../../graph'
import wrapBlock from '../library/wrapBlock'

const flexRoles = getNodesByRole(graph, 'Block:Flex')

if (!flexRoles || flexRoles.length === 0) {
  throw new Error('No Flex block found')
}

export default wrapBlock(flexRoles[0].workload)
